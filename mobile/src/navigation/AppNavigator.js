import CommunityRecipesScreen from '../screens/CommunityRecipesScreen';
import CommunityRecipeDetailScreen from '../screens/CommunityRecipeDetailScreen';
import CommunityRecipeShareScreen from '../screens/CommunityRecipeShareScreen';
import ProfileScreen from '../screens/ProfileScreen';
 
<Stack.Navigator>
  <Stack.Screen name="CommunityRecipes" component={CommunityRecipesScreen} options={{ title: 'Topluluk Tarifleri' }} />
  <Stack.Screen name="CommunityRecipeDetail" component={CommunityRecipeDetailScreen} options={{ title: 'Tarif Detayı' }} />
  <Stack.Screen name="CommunityRecipeShare" component={CommunityRecipeShareScreen} options={{ title: 'Tarif Paylaş' }} />
  <Stack.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
</Stack.Navigator> 