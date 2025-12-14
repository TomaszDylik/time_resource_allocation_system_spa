import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import UserProfileForm from '../components/UserProfileForm';
import { validateProfileForm, updateUserProfile } from '../utils/profileHelpers';

function UserProfile() {
  // get context
  const { user: currentUser, logout, login } = useAuth();
  const { users: allUsers, reservations: allReservations, resources: allResources, saveData } = useDatabase();
  const navigate = useNavigate();
  
  // form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    newPassword: ''
  });
  // validation error states
  const [errors, setErrors] = useState({});
  
  // access control (only for users)
  if (currentUser?.role === 'admin') {
    navigate('/admin');
    return null;
  }
  
  // handle form field changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
  
  // handle form submission
  function handleSave(e) {
    // prevent default form submission
    e.preventDefault();
    
    // validate form fields using helper function
    // if any errors, set error state and abort save
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // update user 
    updateUserProfile(currentUser, formData, allUsers, allReservations, allResources, saveData, login);
    
    alert('Profil zaktualizowany!');
    // clear password field after successful save
    setFormData(prev => ({ ...prev, newPassword: '' }));
  }
  
  return (
    <div>
      <DashboardHeader currentUser={currentUser} logoutFunction={logout} title="Profil" />
      
      <div className="dashboard-container">
        <div className="section-card">
          <div className="profile-header">
            <h2 className="section-title">Edycja profilu</h2>
            <button className="back-button" onClick={() => navigate('/user')}>
              ← Powrót
            </button>
          </div>
          
          <UserProfileForm 
            currentUser={currentUser}
            formData={formData}
            errors={errors}
            onSubmit={handleSave}
            onChange={handleChange}
            onCancel={() => navigate('/user')}
          />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
