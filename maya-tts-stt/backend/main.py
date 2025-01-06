from io import BytesIO
import tempfile
import time
import traceback
import logging

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pyparsing import lru_cache
import torchaudio
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import soundfile as sf
import numpy as np
from pydub import AudioSegment
from pathlib import Path as PathLib
from transformers import AutoTokenizer, VitsModel

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up detailed logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load model and processor
logger.info("Loading Wav2Vec2 model and processor...")
model_name = "sumedh/wav2vec2-large-xlsr-marathi"
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2ForCTC.from_pretrained(model_name)
logger.info("Wav2Vec2 model and processor loaded successfully.")

VALID_AUDIO_MIME_TYPES = ["audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/mpeg"]

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    logger.info(f"Received transcription request for file: {file.filename}")
    if file.content_type not in VALID_AUDIO_MIME_TYPES:
        error_msg = f"Invalid file type: {file.content_type}. Supported types: {', '.join(VALID_AUDIO_MIME_TYPES)}"
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

    try:
        audio_bytes = await file.read()
        logger.info(f"File {file.filename} read successfully. Size: {len(audio_bytes)} bytes.")

        # Convert M4A to WAV if needed
        if file.content_type in ["audio/mp4", "audio/m4a", "audio/x-m4a"]:
            logger.info(f"Converting file {file.filename} from M4A to WAV format.")
            audio = AudioSegment.from_file(BytesIO(audio_bytes), format="m4a")
            wav_bytes = BytesIO()
            audio.export(wav_bytes, format="wav")
            wav_bytes.seek(0)
            audio_bytes = wav_bytes.read()
            logger.info("Conversion to WAV completed.")

        # Load audio using torchaudio or fallback to soundfile
        try:
            logger.info(f"Attempting to load audio using torchaudio.")
            waveform, sample_rate = torchaudio.load(BytesIO(audio_bytes))
        except Exception as e:
            logger.warning(f"Torchaudio failed to load audio: {e}. Falling back to soundfile.")
            audio_data, sample_rate = sf.read(BytesIO(audio_bytes))
            waveform = torch.FloatTensor(audio_data)
            if len(waveform.shape) == 1:
                waveform = waveform.unsqueeze(0)

        logger.info(f"Audio loaded successfully. Sample rate: {sample_rate}, Shape: {waveform.shape}.")

        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            logger.info(f"Converting stereo audio to mono.")
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # Resample if necessary
        if sample_rate != 16000:
            logger.info(f"Resampling audio from {sample_rate}Hz to 16000Hz.")
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)

        # Normalize audio
        logger.info(f"Normalizing audio waveform.")
        waveform = (waveform - waveform.mean()) / (waveform.std() + 1e-10)

        # Process audio and generate transcription
        input_values = processor(waveform.squeeze().numpy(), sampling_rate=16000, return_tensors="pt").input_values
        logger.info("Running inference on the audio.")
        with torch.no_grad():
            logits = model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.decode(predicted_ids[0])

        logger.info(f"Transcription completed successfully: {transcription.strip()}")
        return {"transcription": transcription.strip()}

    except Exception as e:
        error_msg = f"Error processing audio file: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)


# Cache directory for audio files
CACHE_DIR = PathLib(tempfile.gettempdir()) / "tts_cache"
CACHE_DIR.mkdir(exist_ok=True)
logger.info(f"Cache directory for TTS audio files: {CACHE_DIR}")

@lru_cache(maxsize=1)
def get_tts_components():
    logger.info("Loading TTS model and tokenizer...")
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    model = VitsModel.from_pretrained("facebook/mms-tts-mar").to(device)
    tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-mar")
    logger.info("TTS model and tokenizer loaded successfully.")
    return model, tokenizer, device

def get_cache_key(text: str) -> str:
    logger.debug(f"Generating cache key for text: {text}")
    return f"{hash(text)}"

def get_cached_audio_path(cache_key: str) -> PathLib:
    path = CACHE_DIR / f"{cache_key}.wav"
    logger.debug(f"Cache path for key {cache_key}: {path}")
    return path

class TTSRequest(BaseModel):
    text: str

@app.post("/tts/")
async def text_to_speech(request: TTSRequest):
    logger.info(f"Received TTS request for text: {request.text}")
    try:
        cache_key = get_cache_key(request.text)
        cache_path = get_cached_audio_path(cache_key)

        if cache_path.exists():
            logger.info(f"Returning cached audio for text: {request.text}")
            return FileResponse(path=cache_path, media_type="audio/wav", filename="speech.wav")

        model, tokenizer, device = get_tts_components()

        logger.info("Tokenizing input text.")
        inputs = tokenizer(request.text, return_tensors="pt").to(device)

        logger.info("Generating audio waveform.")
        with torch.no_grad():
            output = model(**inputs).waveform

        audio_arr = output.cpu().numpy().squeeze()
        sf.write(str(cache_path), audio_arr, model.config.sampling_rate)
        logger.info(f"Audio generated and saved at {cache_path}")

        return FileResponse(path=cache_path, media_type="audio/wav", filename="speech.wav")

    except Exception as e:
        error_msg = f"Error generating speech: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)
    
# # Cache directory for audio files
# CACHE_DIR = PathLib(tempfile.gettempdir()) / "tts_cache"
# CACHE_DIR.mkdir(exist_ok=True)

# # Initialize components with caching
# @lru_cache(maxsize=1)
# def get_tts_components():
#     device = "cuda:0" if torch.cuda.is_available() else "cpu"
#     model = ParlerTTSForConditionalGeneration.from_pretrained("ai4bharat/indic-parler-tts").to(device)
#     tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indic-parler-tts")
#     description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
#     return model, tokenizer, description_tokenizer, device

# # Cache audio files
# def get_cache_key(text: str, description: str) -> str:
#     return f"{hash(text + description)}"

# def get_cached_audio_path(cache_key: str) -> Path:
#     return CACHE_DIR / f"{cache_key}.wav"

# class TTSRequest(BaseModel):
#     text: str
#     description: str = "A female speaker with a neutral accent delivers a natural speech"

# @app.post("/tts/")
# async def text_to_speech(request: TTSRequest):
#     try:
#         # Generate cache key
#         cache_key = get_cache_key(request.text, request.description)
#         cache_path = get_cached_audio_path(cache_key)

#         # Return cached audio if available
#         if cache_path.exists():
#             return FileResponse(
#                 path=cache_path,
#                 media_type="audio/wav",
#                 filename="speech.wav"
#             )

#         # Get or initialize TTS components
#         model, tokenizer, description_tokenizer, device = get_tts_components()

#         # Process in half precision for speed
#         with torch.cuda.amp.autocast() if torch.cuda.is_available() else nullcontext():
#             # Generate audio
#             description_inputs = description_tokenizer(
#                 request.description, 
#                 return_tensors="pt",
#                 padding=True,
#                 truncation=True,
#                 max_length=512
#             ).to(device)

#             prompt_inputs = tokenizer(
#                 request.text,
#                 return_tensors="pt",
#                 padding=True,
#                 truncation=True,
#                 max_length=512
#             ).to(device)

#             generation = model.generate(
#                 input_ids=description_inputs.input_ids,
#                 attention_mask=description_inputs.attention_mask,
#                 prompt_input_ids=prompt_inputs.input_ids,
#                 prompt_attention_mask=prompt_inputs.attention_mask
#             )

#         # Save to cache
#         audio_arr = generation.cpu().numpy().squeeze()
#         sf.write(str(cache_path), audio_arr, model.config.sampling_rate)

#         return FileResponse(
#             path=cache_path,
#             media_type="audio/wav",
#             filename="speech.wav"
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # Context manager for cuda operations
# class nullcontext:
#     def __enter__(self): return None
#     def __exit__(self, *args): return None

# # Cleanup old cache files periodically
# @app.on_event("startup")
# async def cleanup_old_cache():
#     # Delete files older than 24 hours
#     current_time = time.time()
#     for file in CACHE_DIR.glob("*.wav"):
#         if current_time - file.stat().st_mtime > 86400:
#             file.unlink()
            
# # Create temp directory for audio files
# TEMP_DIR = PathLib(tempfile.gettempdir()) / "tts_audio"
# TEMP_DIR.mkdir(exist_ok=True)

# # Initialize TTS components
# def initialize_tts():
#     try:
#         logger.info("Starting Indic Parler TTS initialization...")
#         device = "cuda:0" if torch.cuda.is_available() else "cpu"
#         logger.info(f"Using device: {device}")
        
#         # Load model and tokenizers
#         model = ParlerTTSForConditionalGeneration.from_pretrained("ai4bharat/indic-parler-tts").to(device)
#         tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indic-parler-tts")
#         description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
        
#         logger.info("TTS components initialized successfully")
#         return {
#             'model': model,
#             'tokenizer': tokenizer,
#             'description_tokenizer': description_tokenizer,
#             'device': device
#         }
#     except Exception as e:
#         logger.error("TTS initialization failed!")
#         logger.error(f"Error type: {type(e).__name__}")
#         logger.error(f"Error message: {str(e)}")
#         logger.error("Traceback:")
#         logger.error(traceback.format_exc())
#         raise

# # Initialize TTS engine with proper error handling
# try:
#     logger.info("Attempting to initialize TTS engine...")
#     tts_components = initialize_tts()
#     logger.info("TTS engine initialization successful")
# except Exception as e:
#     logger.error(f"Failed to initialize TTS engine: {str(e)}")
#     tts_components = None

# class TTSRequest(BaseModel):
#     text: str
#     description: str = "A female speaker with a neutral accent delivers a natural speech with a moderate speed and pitch. The recording is of high quality, with the speaker's voice sounding clear and professional."

# @app.post("/tts/")
# async def text_to_speech(request: TTSRequest):
#     if not tts_components:
#         error_msg = "TTS engine not initialized. Check server logs for details."
#         logger.error(error_msg)
#         raise HTTPException(status_code=500, detail=error_msg)

#     try:
#         logger.info(f"Generating speech for text: {request.text}")
        
#         # Generate unique filename
#         timestamp = int(time.time())
#         file_hash = abs(hash(request.text))
#         output_path = TEMP_DIR / f"speech_{timestamp}_{file_hash}.wav"

#         # Prepare inputs
#         description_input_ids = tts_components['description_tokenizer'](
#             request.description,
#             return_tensors="pt"
#         ).to(tts_components['device'])

#         prompt_input_ids = tts_components['tokenizer'](
#             request.text,
#             return_tensors="pt"
#         ).to(tts_components['device'])

#         # Generate audio
#         generation = tts_components['model'].generate(
#             input_ids=description_input_ids.input_ids,
#             attention_mask=description_input_ids.attention_mask,
#             prompt_input_ids=prompt_input_ids.input_ids,
#             prompt_attention_mask=prompt_input_ids.attention_mask
#         )

#         # Convert to audio file
#         audio_arr = generation.cpu().numpy().squeeze()
#         sf.write(
#             str(output_path),
#             audio_arr,
#             tts_components['model'].config.sampling_rate
#         )
            
#         return FileResponse(
#             path=output_path,
#             media_type="audio/wav",
#             filename="speech.wav"
#         )
#     except Exception as e:
#         error_msg = f"TTS generation failed: {str(e)}"
#         logger.error(error_msg)
#         logger.error(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=error_msg)