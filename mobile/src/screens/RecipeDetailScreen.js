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

  const handleShare = async () => {
    try {
      const recipeText = `
${recipe.generatedRecipe.title}

Malzemeler:
${recipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

Hazırlanışı:
${recipe.generatedRecipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

${recipe.generatedRecipe.tips ? `\nPüf Noktaları:\n${recipe.generatedRecipe.tips.map(tip => `💡 ${tip}`).join('\n')}` : ''}
      `.trim();

      await Share.share({
        message: recipeText,
        title: recipe.generatedRecipe.title
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.generatedRecipe.title}</Text>

        <View style={styles.preferencesContainer}>
          {recipe.preferences.map((preference, index) => (
            <View key={index} style={styles.preferenceTag}>
              <Text style={styles.preferenceText}>{preference}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Malzemeler</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
        ))}

        <Text style={styles.sectionTitle}>Hazırlanışı</Text>
        {recipe.generatedRecipe.instructions.map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            {index + 1}. {instruction}
          </Text>
        ))}

        {recipe.generatedRecipe.tips && recipe.generatedRecipe.tips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Püf Noktaları</Text>
            {recipe.generatedRecipe.tips.map((tip, index) => (
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