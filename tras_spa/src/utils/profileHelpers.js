export function validateProfileForm(formData) {
  const errors = {};
  
  // name required
  if (!formData.name.trim()) errors.name = 'Imię wymagane';
  
  // email required + format
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Nieprawidłowy email';
  
  return errors;
}

export function updateUserProfile(currentUser, formData, allUsers, allReservations, allResources, saveData, login) {
  // update user
  const updatedUsers = allUsers.map(user => 
    user.id === currentUser.id 
      ? { 
          ...user, 
          name: formData.name, 
          email: formData.email, 
          password: formData.newPassword || user.password // keep old if empty
        }
      : user
  );
  
  // save
  saveData({ 
    users: updatedUsers,
    reservations: allReservations,
    resources: allResources
  });
  
  // relogin with updated data
  const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
  login(updatedCurrentUser);
  
  return updatedCurrentUser;
}
