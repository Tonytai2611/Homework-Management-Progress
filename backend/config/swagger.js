import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Little Buddies Learning Hub API',
            version: '1.0.0',
            description: 'API documentation for the Homework Management System',
            contact: {
                name: 'API Support',
                email: 'support@littlebuddies.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User unique identifier'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        fullName: {
                            type: 'string',
                            description: 'User full name'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'admin'],
                            description: 'User role'
                        },
                        level: {
                            type: 'string',
                            description: 'Student level (e.g., FLYERS Level)',
                            nullable: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation timestamp'
                        }
                    }
                },
                SignUpRequest: {
                    type: 'object',
                    required: ['email', 'password', 'fullName', 'role'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'leon@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            minLength: 6,
                            example: 'SecurePass123!'
                        },
                        fullName: {
                            type: 'string',
                            example: 'Leon'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'admin'],
                            example: 'student'
                        },
                        level: {
                            type: 'string',
                            example: 'FLYERS Level',
                            description: 'Required for students'
                        }
                    }
                },
                SignInRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'leon@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'SecurePass123!'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful'
                        },
                        token: {
                            type: 'string',
                            description: 'JWT token (expires in 24 hours)'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string'
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: []
    },
    apis: ['./routes/*.js', './server.js']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
