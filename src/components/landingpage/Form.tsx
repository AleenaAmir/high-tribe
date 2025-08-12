"use client";

import React, { useState } from 'react';
import Form2 from './Form2';

const Form = () => {
  const [selectedCountry, setSelectedCountry] = useState('🇬🇧');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('22234 123423');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [fullName, setFullName] = useState('AbdulRehman');
  const [email, setEmail] = useState('AbulRehman@email.com');
  const [country, setCountry] = useState('');

  const countries = [
    { flag: '🇬🇧', code: '+44', name: 'UK' },
    { flag: '🇺🇸', code: '+1', name: 'US' },
    { flag: '🇮🇳', code: '+91', name: 'India' },
    { flag: '🇵🇰', code: '+92', name: 'Pakistan' },
    { flag: '🇨🇦', code: '+1', name: 'Canada' },
    { flag: '🇦🇺', code: '+61', name: 'Australia' },
  ];

  return (
    <div >
      <Form2/>
    </div>
  );
};

export default Form;

