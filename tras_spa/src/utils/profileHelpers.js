export function validateProfileForm(formData) {
  const errors = {};
  
  // name is required - no empty
  if (!formData.name.trim()) errors.name = 'Imię wymagane';
  
  // email is required must match email format
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Nieprawidłowy email';
  
  return errors;
}

export function updateUserProfile(currentUser, formData, allUsers, allReservations, allResources, saveData, login) {
  // Update user while keeping their ID
  const updatedUsers = allUsers.map(user => 
    user.id === currentUser.id 
      ? { 
          ...user, 
          name: formData.name, 
          email: formData.email, 
          password: formData.newPassword || user.password // Keep old password if new one not provided
        }
      : user
  );
  
  // save complete database 
  saveData({ 
    users: updatedUsers,
    reservations: allReservations,
    resources: allResources
  });
  
  // relogin with updated user data
  const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
  login(updatedCurrentUser);
  
  return updatedCurrentUser;
}
