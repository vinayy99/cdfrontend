import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} CollabMate. A College Project Prototype. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;



