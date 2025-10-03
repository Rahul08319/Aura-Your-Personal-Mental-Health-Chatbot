
import React from 'react';

const EmergencySupport: React.FC = () => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-md font-bold text-red-800 dark:text-red-300">Emergency Support</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
            If you are in a crisis or any other person may be in danger, please use these resources.
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-red-700 dark:text-red-400">
              <strong>National Suicide Prevention Lifeline:</strong> <a href="tel:988" className="font-semibold underline hover:text-red-600 dark:hover:text-red-200">988</a>
            </p>
            <p className="text-red-700 dark:text-red-400">
              <strong>Crisis Text Line:</strong> Text HOME to <a href="sms:741741" className="font-semibold underline hover:text-red-600 dark:hover:text-red-200">741741</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupport;
