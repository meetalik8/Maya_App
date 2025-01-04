from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import torchaudio
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import logging
import soundfile as sf
import numpy as np
from pydub import AudioSegment

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load model and processor
model_name = "sumedh/wav2vec2-large-xlsr-marathi"
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2ForCTC.from_pretrained(model_name)

VALID_AUDIO_MIME_TYPES = ["audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/mpeg"]

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    if file.content_type not in VALID_AUDIO_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Supported types: {', '.join(VALID_AUDIO_MIME_TYPES)}"
        )

    try:
        logging.info(f"Received file: {file.filename} with type: {file.content_type}")
        audio_bytes = await file.read()
        
        # Convert M4A to WAV using pydub
        if file.content_type in ["audio/mp4", "audio/m4a", "audio/x-m4a"]:
            audio = AudioSegment.from_file(BytesIO(audio_bytes), format="m4a")
            wav_bytes = BytesIO()
            audio.export(wav_bytes, format="wav")
            wav_bytes.seek(0)
            audio_bytes = wav_bytes.read()

        # Load and process audio
        try:
            waveform, sample_rate = torchaudio.load(BytesIO(audio_bytes))
        except Exception as e:
            logging.error(f"Failed to load audio with torchaudio: {e}")
            # Fallback to soundfile
            audio_data, sample_rate = sf.read(BytesIO(audio_bytes))
            waveform = torch.FloatTensor(audio_data)
            if len(waveform.shape) == 1:
                waveform = waveform.unsqueeze(0)

        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # Resample if necessary
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)

        # Normalize audio
        waveform = (waveform - waveform.mean()) / (waveform.std() + 1e-10)
        
        input_values = processor(waveform.squeeze().numpy(), sampling_rate=16000, return_tensors="pt").input_values
        
        with torch.no_grad():
            logits = model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.decode(predicted_ids[0])

        logging.info(f"Transcription completed: {transcription}")
        return {"transcription": transcription.strip()}
    except Exception as e:
        logging.error(f"Error processing audio file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process the audio file: {str(e)}")