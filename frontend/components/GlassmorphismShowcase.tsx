import React from 'react';
import Link from 'next/link';

const GlassmorphismShowcase: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="glass-heading text-3xl mb-8 text-center">Minimalist UI Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Basic Glass Card */}
        <div className="glass rounded-xl p-6">
          <h3 className="glass-text text-xl font-semibold mb-3">Basic Glass Card</h3>
          <p className="glass-text mb-4">A simple glass card with backdrop blur and light border.</p>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>

        {/* Dark Glass Card */}
        <div className="glass-dark rounded-xl p-6">
          <h3 className="glass-text text-xl font-semibold mb-3">Dark Glass Card</h3>
          <p className="glass-text mb-4">A darker variant with the same glass effect.</p>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass-card">
          <h3 className="glass-text text-xl font-semibold mb-3">Standard Glass Card</h3>
          <p className="glass-text mb-4">Predefined glass card component with proper spacing.</p>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>

        {/* Premium Glass Card */}
        <div className="glass-premium p-6">
          <h3 className="glass-text text-xl font-semibold mb-3">Premium Glass Card</h3>
          <p className="glass-text mb-4">Enhanced with subtle gradient border effect.</p>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>

        {/* Glass Container */}
        <div className="glass-container">
          <h3 className="glass-text text-xl font-semibold mb-3">Glass Container</h3>
          <p className="glass-text mb-4">A standard container with glass effect for content.</p>
          <div className="glass-progress mb-4">
            <div className="glass-progress-bar w-3/4"></div>
          </div>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>

        {/* Floating Glass Card */}
        <div className="glass-floating p-6">
          <h3 className="glass-text text-xl font-semibold mb-3">Floating Card</h3>
          <p className="glass-text mb-4">Hover to see the floating animation effect.</p>
          <div className="flex justify-end">
            <button className="glass-button">Learn More</button>
          </div>
        </div>
      </div>

      <h2 className="glass-heading text-2xl mt-12 mb-6 text-center">UI Elements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buttons */}
        <div className="glass-container">
          <h3 className="glass-text text-xl font-semibold mb-4">Button Styles</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button className="glass-button">Standard</button>
              <button className="glass-button bg-accent-500/30">Accent</button>
              <button className="glass-button border-glass-glow">Glowing</button>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="glass-container">
          <h3 className="glass-text text-xl font-semibold mb-4">Form Elements</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              className="glass-input mb-3" 
              placeholder="Glass Input"
            />
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="glassCheckbox" 
                className="w-5 h-5 rounded border-glass accent-accent-500/70"
              />
              <label htmlFor="glassCheckbox" className="glass-text">Glass Checkbox</label>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-container mt-8">
        <h3 className="glass-text text-xl font-semibold mb-4">Border Styles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-glass rounded-xl p-4 border-glass">
            <p className="glass-text text-center">Simple Border</p>
          </div>
          <div className="bg-glass rounded-xl p-4 border-glass-strong">
            <p className="glass-text text-center">Gradient Border</p>
          </div>
          <div className="bg-glass rounded-xl p-4 border-glass-glow">
            <p className="glass-text text-center">Glowing Border</p>
          </div>
          <div className="glass-premium rounded-xl p-4">
            <p className="glass-text text-center">Animated Border</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismShowcase; 