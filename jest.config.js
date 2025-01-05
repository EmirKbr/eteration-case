module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/node_modules/identity-obj-proxy',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};