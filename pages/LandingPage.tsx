
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const steps = [
    { number: 1, title: 'Create Your Profile', description: 'Showcase your skills, experience, and what you\'re looking for in a collaborator.', icon: '👤' },
    { number: 2, title: 'Post or Find Projects', description: 'Share your project idea with the community or browse existing projects that need your expertise.', icon: '🚀' },
    { number: 3, title: 'Connect and Collaborate', description: 'Find your perfect match, connect with them, and start creating something amazing together.', icon: '🤝' },
  ];

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-dark tracking-tight">
          Find your perfect teammate for
        </h1>
        <h2 className="text-4xl sm:text-6xl font-extrabold text-primary tracking-tight mt-2">
          your next project.
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          CollabMate is the ultimate platform for students, freelancers, and creators to connect, share skills, and build amazing things together.
        </p>
        <div className="mt-8">
          <Link
            to="/auth"
            className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-dark mb-2">How It Works</h2>
          <p className="text-gray-500 mb-12">Getting started is simple. Follow these three easy steps.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="p-6 rounded-lg text-center">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
