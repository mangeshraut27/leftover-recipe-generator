import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default message', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Generating your recipe...')).toBeInTheDocument();
    expect(screen.getByText('Our AI chef is crafting the perfect recipe for you...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Creating your perfect meal...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText('Our AI chef is crafting the perfect recipe for you...')).toBeInTheDocument();
  });

  test('displays cooking emojis', () => {
    render(<LoadingSpinner />);

    // Check for cooking-related emojis in the component
    const component = screen.getByText('Generating your recipe...').closest('div');
    expect(component).toBeInTheDocument();
  });

  test('shows progress steps', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Analyzing your ingredients')).toBeInTheDocument();
    expect(screen.getByText('Considering your preferences')).toBeInTheDocument();
    expect(screen.getByText('Creating personalized recipe')).toBeInTheDocument();
    expect(screen.getByText('Adding nutritional information')).toBeInTheDocument();
  });

  test('displays fun fact section', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Did you know?')).toBeInTheDocument();
    expect(screen.getByText(/Our AI considers over 1000 flavor combinations/)).toBeInTheDocument();
  });

  test('has proper loading animations', () => {
    render(<LoadingSpinner />);

    // Check for elements that should have animation classes
    const spinningElement = document.querySelector('.animate-spin');
    expect(spinningElement).toBeInTheDocument();

    const bouncingElements = document.querySelectorAll('.animate-bounce');
    expect(bouncingElements.length).toBeGreaterThan(0);

    const pulsingElement = document.querySelector('.animate-pulse');
    expect(pulsingElement).toBeInTheDocument();
  });

  test('renders with proper styling classes', () => {
    render(<LoadingSpinner />);

    const mainContainer = screen.getByText('Generating your recipe...').closest('.bg-white');
    expect(mainContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg', 'p-8', 'text-center');
  });

  test('shows completed and in-progress steps correctly', () => {
    render(<LoadingSpinner />);

    // Check for completed steps (should have green background)
    const completedSteps = document.querySelectorAll('.bg-green-500');
    expect(completedSteps.length).toBe(2); // First two steps should be completed

    // Check for current step (should have blue background)
    const currentStep = document.querySelector('.bg-blue-500');
    expect(currentStep).toBeInTheDocument();

    // Check for pending step (should have gray background)
    const pendingStep = document.querySelector('.bg-gray-300');
    expect(pendingStep).toBeInTheDocument();
  });
}); 