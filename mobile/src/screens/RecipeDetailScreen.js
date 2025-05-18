import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share
} from 'react-native';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  // AI ve community ayrımı
  const isAIRecipe = !!recipe.generatedRecipe;
  let title, ingredients, instructions, tips, preferences;
  if (isAIRecipe) {
    let gen = recipe.generatedRecipe;
    if (typeof gen === 'string') {
      try {
        gen = JSON.parse(gen);
      } catch (e) {
        gen = {};
      }
    }
    title = gen.title || 'Başlıksız Tarif';
    ingredients = gen.ingredients || recipe.ingredients || [];
    instructions = gen.instructions || [];
    tips = gen.tips || [];
    preferences = recipe.preferences || [];
  } else {
    title = recipe.title || 'Başlıksız Tarif';
    ingredients = recipe.ingredients || [];
    instructions = recipe.steps || [];
    tips = [];
    preferences = recipe.preferences || [];
  }

  const handleShare = async () => {
    try {
      const recipeText = `
${title}

Malzemeler:
${ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

Hazırlanışı:
${instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

${tips && tips.length > 0 ? `\nPüf Noktaları:\n${tips.map(tip => `💡 ${tip}`).join('\n')}` : ''}
      `.trim();

      await Share.share({
        message: recipeText,
        title: title
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.preferencesContainer}>
          {preferences.map((preference, index) => (
            <View key={index} style={styles.preferenceTag}>
              <Text style={styles.preferenceText}>{preference}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Malzemeler</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
        ))}

        <Text style={styles.sectionTitle}>{isAIRecipe ? 'Hazırlanışı' : 'Yapılış Adımları'}</Text>
        {instructions.map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            {isAIRecipe ? `${index + 1}. ` : ''}{instruction}
          </Text>
        ))}

        {isAIRecipe && tips && tips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Püf Noktaları</Text>
            {tips.map((tip, index) => (
              <Text key={index} style={styles.tip}>💡 {tip}</Text>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Tarifi Paylaş</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
    textAlign: 'center',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  preferenceTag: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 14,
    color: '#3949ab',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3949ab',
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 8,
    paddingLeft: 8,
    lineHeight: 24,
  },
  instruction: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 16,
    paddingLeft: 8,
    lineHeight: 24,
  },
  tip: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 12,
    paddingLeft: 8,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  shareButton: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecipeDetailScreen; 