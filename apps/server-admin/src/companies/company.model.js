'use strict';

import mongoose from 'mongoose';

const categories = [
    'TECNOLOGIA',
    'ALIMENTOS_Y_BEBIDAS',
    'TEXTIL_Y_CALZADO',
    'AUTOMOTRIZ',
    'CONSTRUCCION',
    'SALUD_Y_BELLEZA',
    'HOGAR_Y_DECORACION',
    'ARTESANIAS',
    'AGROINDUSTRIA',
    'SERVICIOS_FINANCIEROS',
    'OTRO'
];

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido."],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "La descripción es requerida."]
    },
    address: {
        type: String,
        required: [true, "La dirección es requerida."]
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Ingrese un correo electrónico válido"]
    },
    phone: {
        type: String,
        required: [true, "El teléfono es obligatorio"],
        trim: true,
        match: [/^[0-9]{8,8}$/, "Ingrese un número de teléfono válido"]
    },
    levelImpact: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'EXCELLENT'],
    },

    yearsTrayectory: {
        type: Number,
        required: [true, 'Los años de trayectoria son obligatorios'],
        min: [0, 'Los años de trayectoria no pueden ser negativos']
    },
    category: {
        type: String,
        enum: {
            values: categories,
            message: '{VALUE} no es una categoría válida'
        },
        required: [true, 'La categoría empresarial es obligatoria']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

companySchema.index( { isActive: 1 } );
companySchema.index( { category: 1 } );
companySchema.index( { levelImpact: 1 } );
companySchema.index( { yearsTrayectory: 1 } );
companySchema.index( { name: 1, isActive: 1 } );

export default mongoose.model('Company', companySchema);