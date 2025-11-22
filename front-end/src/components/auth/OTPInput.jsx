import React, { useRef, useEffect } from 'react';

/**
 * OTP Input Component
 * A 6-digit OTP input with auto-focus and paste support
 */
const OTPInput = ({ value, onChange, onComplete, error, disabled }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const input = e.target;
    const newValue = input.value.replace(/[^0-9]/g, ''); // Only allow numbers

    if (newValue.length > 1) {
      // Handle paste
      const pastedValue = newValue.slice(0, 6);
      const newOTP = value.split('');
      for (let i = 0; i < pastedValue.length && (index + i) < 6; i++) {
        newOTP[index + i] = pastedValue[i];
      }
      onChange(newOTP.join(''));
      
      // Focus last input or submit
      const nextIndex = Math.min(index + pastedValue.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      } else if (newOTP.join('').length === 6) {
        onComplete?.(newOTP.join(''));
      }
      return;
    }

    // Update value
    const newOTP = value.split('');
    newOTP[index] = newValue;
    onChange(newOTP.join(''));

    // Move to next input if value entered
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const updatedOTP = newOTP.join('');
    if (updatedOTP.length === 6) {
      onComplete?.(updatedOTP);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      onChange(pastedData.padEnd(6, ''));
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      if (pastedData.length === 6) {
        onComplete?.(pastedData);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2 sm:gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 ${
              error
                ? 'border-red-500 bg-red-50'
                : value[index]
                ? 'border-[var(--brand-color)] bg-orange-50'
                : 'border-stone-300 bg-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};

export default OTPInput;

