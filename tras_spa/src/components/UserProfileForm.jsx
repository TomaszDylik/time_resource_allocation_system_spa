function UserProfileForm({ formData, errors, onSubmit, onChange, onCancel }) {
  return (
    <form className="profile-form" onSubmit={onSubmit}>
      {/* name field */}
      <div className="form-group">
        <label className="form-label">Imię i nazwisko</label>
        <input 
          type="text" 
          name="name" 
          className={`form-input ${errors.name ? 'error' : ''}`} 
          value={formData.name} 
          onChange={onChange} 
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      
      {/* email field - valid format */}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input 
          type="email" 
          name="email" 
          className={`form-input ${errors.email ? 'error' : ''}`} 
          value={formData.email} 
          onChange={onChange} 
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      
      {/* password section */}
      <div className="password-section">
        <h3 className="subsection-title">Zmiana hasła</h3>
        <div className="form-group">
          <label className="form-label">Nowe hasło</label>
          <input 
            type="password" 
            name="newPassword" 
            className={`form-input ${errors.newPassword ? 'error' : ''}`} 
            value={formData.newPassword} 
            onChange={onChange} 
            placeholder="Pozostaw puste, aby nie zmieniać" 
          />
          {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
        </div>
      </div>
      
      {/* action buttons */}
      <div className="profile-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Anuluj
        </button>
        <button type="submit" className="save-btn">
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
}

export default UserProfileForm;
