import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Phrase, phrases } from '../constants/phrases';
import { Ionicons } from '@expo/vector-icons';

const PhraseListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Extract module name from route params
  const { module } = route.params as { module: string };

  // Retrieve the list of phrases for the selected module
  const modulePhrases = phrases[module];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{module} in Marathi</Text>
      <FlatList
        data={modulePhrases}
        keyExtractor={(item) => item.phrase}
        renderItem={({ item }: { item: Phrase }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PhraseLearn', {
                phrase: item,  // Pass the selected phrase
                module,         // Pass the module name
              })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.phrase}>{item.phrase}</Text>
              <Ionicons name="chevron-forward" size={24} color="#007BFF" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f3fb',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 10,
    transform: [{ scale: 1 }],
    // transition: 'all 0.2s ease-in-out',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phrase: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
});

export default PhraseListScreen;
