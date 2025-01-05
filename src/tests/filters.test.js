import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../components/Filters';

describe('Filters Component', () => {
    const mockProps = {
        brandsList: ['Brand1', 'Brand2', 'Brand3'],
        selectedBrands: ['Brand1'],
        setSelectedBrands: jest.fn(),
        availableModels: ['Model1', 'Model2', 'Model3'],
        selectedModels: ['Model1'],
        setSelectedModels: jest.fn(),
        sortOrder: 'oldToNew',
        setSortOrder: jest.fn(),
        brandSearch: '',
        setBrandSearch: jest.fn(),
        modelSearch: '',
        setModelSearch: jest.fn(),
    };

    test('renders all sorting options', () => {
        render(<Filters {...mockProps} />);
        expect(screen.getByText('Old to new')).toBeInTheDocument();
        expect(screen.getByText('New to old')).toBeInTheDocument();
        expect(screen.getByText('Price high to low')).toBeInTheDocument();
        expect(screen.getByText('Price low to high')).toBeInTheDocument();
    });

    test('renders brand checkboxes correctly', () => {
        render(<Filters {...mockProps} />);
        mockProps.brandsList.forEach(brand => {
            expect(screen.getByText(brand)).toBeInTheDocument();
        });
    });

    test('shows "No model available" when models list is empty', () => {
        const propsWithNoModels = {
            ...mockProps,
            availableModels: []
        };
        render(<Filters {...propsWithNoModels} />);
        expect(screen.getByText('No model available.')).toBeInTheDocument();
    });
});