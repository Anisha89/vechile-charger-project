import { Injectable } from '@angular/core';

@Injectable()
export class UnitConversionFormulaService {

    constructor() { }


    convertUnitWithoutTargetUnit(source: string, value: any) {
        if (typeof value === 'undefined' || value == null) {
            return '';
        }
            switch (source) {
                // m/sq.s - ft/sq.s, m/s - ft/s,  - ft/min, m/hr - ft/hr, m - ft
                case 'm/sq.s':
                case 'm/s':
                case 'm/min':
                case 'm/hr':
                case 'm':
                    value = (value * 3.28084);
                    break;
                // sq.m - sq.ft
                // sq.m - sq.yd
                case 'sq.m':
                    value = (value * 10.7639);
                    break;
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft, kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                // cd/sq.m - cd/sq.ft
                case 'W-hr/sq.m':
                case 'kW-hr/sq.m':
                case 'MW-hr/sq.m':
                case 'MJ/sq.m':
                case 'BTU/hr/sq.m':
                case 'W/sq.m':
                case 'cd/sq.m':
                case 'MW/sq.m':
                case 'kW/sq.m':
                case 'kBTU/hr/sq.m':
                case 'kBTU/sq.m':
                case 'KBTU/sq.m':
                case 'BTU/sq.m':
                    value = (value / 10.7639);
                    break;
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'mL':
                case 'mL/s':
                case 'mL/min':
                    value = (value * 0.033814);
                    break;
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'mm':
                case 'mmHg':
                case 'dmm Hg':
                case 'mm/s':
                case 'mm/min':
                    value = (value * 0.0393701);
                    break;
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L - g, L - galUK
                case 'L':
                case 'L/s':
                case 'L/min':
                case 'L/hr':
                    value = (value * 0.264172);
                    break;
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'g':
                case 'g/s':
                case 'g/min':
                    value = (value * 0.035274);
                    break;
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'cm':
                case 'cm/wc':
                case 'cmHg':
                case 'dcm/wc':
                case 'dcm Hg':
                    value = (value * 0.393701);
                    break;
                // km - mile, km/s - mile/s, km/hr - mph
                case 'KM':
                case 'km':
                case 'km/s':
                case 'km/hr':
                    value = (value * 0.621369949);
                    break;
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'kg':
                case 'kg/min':
                case 'kg/hr':
                case 'kg/s':
                    value = (value / 0.453592);
                    break;
                // km/L - mile/gal
                case 'km/L':
                    value = (value * 2.352145572);
                    break;
                // ft/s - m/s, ft/min - m/min
                case 'm/s':
                case 'm/min':
                    value = (value * 0.30479999);
                    break;
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.m':
                case 'cu.m/min':
                case 'cu.m/hr':
                case 'cu.m/s':
                    value = (value * 35.3147);
                    break;
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/m':
                case '%obsc/m':
                    value = (value * 0.30479999);
                    break;
                // &microg/cu.m - oz/cu.ft
                case '&microg/cu.m':
                    value = (value * 0.000000000998848);
                    break;
                // mg/cu.m - oz/cu.ft
                case 'mg/cu.m':
                    value = (value * 0.000000998848);
                    break;
                // &microm - in
                case '&microm':
                    value = (value * 0.00003937);
                    break;
                // cu.mm - cu.in
                case 'cu.mm':
                    value = (value * 0.0000610237);
                    break;
                // Pa - psi
                case 'Pa':
                    value = (value * 0.000145038);
                    break;
                // MPa - psi
                case 'MPa':
                    value = (value * 145.038);
                    break;
                // kL - gal
                case 'kL':
                    value = (value * 264.172);
                    break;
                // g/cu.m - oz/cu.ft
                case 'g/cu.m':
                    value = (value * 0.000998848);
                    break;
                // sq.mm - sq.in
                case 'sq.mm':
                    value = (value * 0.00155);
                    break;
                // g/sq.m - oz/sq.ft
                case 'g/sq.m':
                    value = (value * 0.003277065);
                    break;
                // A/sq.m - A/sq.ft, J/sq.m - J/sq.ft
                case 'A/sq.m':
                case 'J/sq.m':
                    value = (value * 0.09290313);
                    break;
                // mg - grain
                case 'mg':
                    value = (value * 0.0154324);
                    break;
                // cu.cm - cu.in
                case 'cu.cm':
                    value = (value * 0.0610237);
                    break;
                // kg/cu.m - lb/cu.ft
                case 'kg/cu.m':
                    value = (value * 0.062427974);
                    break;
                // N/m - lbf/ft
                case 'N/m':
                    value = (value * 0.0685218);
                    break;
                // kPa - psi
                case 'kPa':
                    value = (value * 0.145038);
                    break;
                // sq.cm - sq.in
                // sq.cm - sq.inch
                case 'sq.cm':
                    value = (value * 0.155);
                    break;
                // kg/sq.m - lb/sq.ft
                case 'kg/sq.m':
                    value = (value * 0.204816098);
                    break;
                // N - lbf
                case 'N':
                    value = (value * 0.224809);
                    break;
                // sq.km - sq.mile
                case 'sq.km':
                    value = (value * 0.386102);
                    break;
                // N-m - lb-ft
                case 'N-m':
                    value = (value * 0.737562);
                    break;
                // Nm/sec - ft-lbs/sec
                case 'Nm/sec':
                    value = (value / 1.355818223);
                    break;
                // &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degC/hr':
                case '&degC/min':
                case '&degdaysC':
                case '&degC':
                case 'd&degC':
                    value = ((value * (9 / 5)) + 32);
                    break;
                // psi/&degC - psi/&degF
                case 'psi/&degC':
                    value = (1 / ((value * (9 / 5)) + 32));
                    break;
                // m/sq.s - ft/sq.s, m/s - ft/s, m/min - ft/min, m/hr - ft/hr, m - ft
                case 'ft/sq':
                case 'ft/s':
                case 'ft/min':
                case 'ft/hr':
                case 'ft':
                    value = (value / 3.28084);
                    break;
                // sq.m - sq.ft
                case 'sq.ft':
                    value = (value / 10.7639);
                    break;
                // sq.m - sq.yd
                case 'sq.yd':
                    value = (value * 0.836127);
                    break;
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft,  kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                case 'W-hr/sq.ft':
                case 'kW-hr/sq.ft':
                case 'MW-hr/sq.ft':
                case 'MJ/sq.ft':
                case 'BTU/hr/sq.ft':
                case 'W/sq.ft':
                case 'cd/sq.ft':
                case 'MW/sq.ft':
                case 'kW/sq.ft':
                case 'kBTU/hr/sq.ft':
                case 'kBTU/sq.ft':
                case 'KBTU/sq.ft':
                case 'BTU/sq.ft':
                    value = (value * 10.7639);
                    break;
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'fl oz':
                case 'fl oz/s':
                case 'fl oz/min':
                    value = (value / 0.033814);
                    break;
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'inHg':
                case 'din Hg':
                case 'in/s':
                case 'in/min':
                    value = (value / 0.0393701);
                    break;
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L/min - galUK/min, kL - gal
                case 'gal':
                case 'gal/s':
                case 'gal/min':
                case 'gal/hr':
                    value = (value / 0.264172);
                    break;
                // L - galUK
                // L/min - galUK/min
                case 'galUK':
                case 'galUK/min':
                    value = (value * 4.54609);
                    break;
                // km/L - mile/gal
                case 'mile/gal':
                    value = (value / 2.352145572);
                    break;
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'oz':
                case 'oz/s':
                case 'oz/min':
                    value = (value / 0.035274);
                    break;
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'in':
                case 'in/wc':
                case 'inHg':
                case 'din/wc':
                case 'din Hg':
                    value = (value / 0.393701);
                    break;
                // km - mile, km/s - mile/s, km/hr - mph
                case 'mile':
                case 'mile/s':
                case 'mph':
                    value = (value / 0.621369949);
                    break;
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'lb':
                case 'lb/min':
                case 'lb/hr':
                case 'lb/s':
                    value = (value * 0.453592);
                    break;
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.ft':
                case 'cu.ft/min':
                case 'cu.ft/hr':
                case 'cu.ft/s':
                    value = (value / 35.3147);
                    break;
                // cu.m - cu.yd
                case 'cu.yd':
                    value = (value * 0.764555);
                    break;
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/ft':
                case '%obsc/ft':
                    value = (value / 0.30479999);
                    break;
                // ft/s - m/s, ft/min - m/min
                case 'ft/s':
                case 'ft/min':
                    value = (value / 0.30479999);
                    break;
                // &microg/cu.m - oz/cu.ft, mg/cu.m - oz/cu.ft
                // &microg/cu.m - oz/cu.ft
                // mg/cu.m - oz/cu.ft
                // g/cu.m - oz/cu.ft
                case 'oz/cu.ft':
                    value = (value / 0.000000000998848);
                    break;
                // &microm - in
                // case 'in':
                // value = (value / 0.00003937);
                // break;
                // cu.mm - cu.in
                // cu.cm - cu.in
                case 'cu.in':
                    value = (value / 0.0000610237);
                    break;
                // Pa - psi, MPa - psi
                case 'psi':
                    value = (value / 0.145038);
                    break;
                // sq.mm - sq.in
                // sq.cm - sq.in
                case 'sq.in':
                    value = (value / 0.155);
                    break;
                // A/sq.m - A/sq.ft, J/sq.m - J/sq.ft
                case 'A/sq.ft':
                case 'J/sq.ft':
                    value = (value / 0.09290313);
                    break;
                // g/sq.m - oz/sq.ft
                case 'oz/sq.ft':
                    value = (value / 0.003277065);
                    break;
                // mg - grain
                case 'grain':
                    value = (value / 0.0154324);
                    break;
                // kg/cu.m - lb/cu.ft
                case 'lb/cu.ft':
                    value = (value / 0.062427974);
                    break;
                // N/m - lbf/ft
                case 'lbf/ft':
                    value = (value / 0.0685218);
                    break;
                // kPa - psi
                case 'psi':
                    value = (value / 0.145038);
                    break;
                // sq.cm - sq.inch
                case 'sq.inch':
                    value = (value / 0.155);
                    break;
                // kg/sq.m - lb/sq.ft
                case 'lb/sq.ft':
                    value = (value / 0.204816098);
                    break;
                // N - lbf
                case 'lbf':
                    value = (value / 0.224809);
                    break;
                // sq.km - sq.mile
                case 'sq.mile':
                    value = (value / 0.386102);
                    break;
                // N-m - lb-ft
                case 'lb-ft':
                    value = (value / 0.737562);
                    break;
                // hectare - acre
                case 'acre':
                    value = (value * 0.404686);
                    break;
                // N - lbf
                case 'lbf':
                    value = (value * 4.44822);
                    break;
                // m - ft
                case 'ft':
                    value = (value * 0.3048);
                    break;
                // m - yd
                case 'yd':
                    value = (value * 0.9144);
                    break;
                // L - qt
                case 'qt':
                    value = (value * 0.946353);
                    break;
                // L - pt
                case 'pt':
                    value = (value * 0.4731765);
                    break;
                // Nm/sec - ft-lbs/sec
                case 'ft-lbs/sec':
                    value = (value * 1.355818223);
                    break;
                // &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degF/hr':
                case '&degF/min':
                case '&degdaysF':
                case '&degF':
                case 'd&degF':
                    value = ((value - 32) / (9 / 5));
                    break;
                // psi/&degC - psi/&degF
                case 'psi/&degF':
                    value = ((value * (9 / 5)) + 32);
                    break;
                default:
                    // C - F, J-s, rpm, VA, VA-hr, kVA, kVA-hr, MVA, MVA-hr, F, ppu, ppm, ppb, g/kg, C, Ah, mAh, s, S, S/m, /s, /min, min,
                    // /hr, hr, A, A/sq.m, mA, V/m. V, mV, MV, kV, ohm, kohm, Mohm, mohm, ohm-m', GJ, W-hr, kW-hr, MW-hr, MBTU, hp-hr, cal,
                    // cal/g, therm, Dth, tR-hr, dkJ/kg, dBTU/lb, Hz, kHz, cph, cpm, MHz, %, %/s, k, K/s, K/hr, K/min, lx, klx, cd, H, b, B,
                    // cd/sq.ft, fc, b/s, B/s, Kb, KB, Kb/s, KB/s, Mb, MB, Mb/s, MB/s, Gb, GB, Gb/s, GB/s, Tb, TB, Tb/s, TB/s, N-s, ns, rad,
                    // ftcd, lm, Wb, T, t, ton, ton/hr, db, pf, pH, %RH, gH20/kgAir, V/K, sq.m/N, W/sq.mK, A sq.m, dBmV, dBuV, atm, psig,
                    // rad/s, rad/sq.s, &deg, &degph, kBTU/hr, kBTU, mW, MW, kW, GW, BTU, BTU/hr, BTU/lb, btu/lb, hp, tR, bar, hpa, mbar,
                    // torr, dPa, dkPa, dbar, datm, dpsi, dhpa, dmbar, dtorr, var, var_hr, kvar, kvar-hr, Mvar, Mvar-hr, sr, J, J/Kg, fnu
                    // J/sq.m, J/kgK, J/kg, J/g, J/K, KJ, kJ/Kg, kJ/K, MJ, MJ/Kg, MJ/K, N/m, dK, W/K, us, ms, cs, ds, day, wk, mo, yr, ntu
                    value = value;
        }
        // return typeof value === 'string' ? value : Number(value).toFixed(3);
        return value;
    }
    convertUnit(source: string, targetUnit: string, value: any) {
        if (typeof value === 'undefined' || value == null) {
            return '';
        }

        if (targetUnit === 'Imperial') {
            switch (source) {
                // m/sq.s - ft/sq.s, m/s - ft/s,  - ft/min, m/hr - ft/hr, m - ft
                case 'm/sq.s':
                case 'm/s':
                case 'm/min':
                case 'm/hr':
                case 'm':
                    value = (value * 3.28084);
                    break;
                // sq.m - sq.ft
                // sq.m - sq.yd
                case 'sq.m':
                    value = (value * 10.7639);
                    break;
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft, kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                // cd/sq.m - cd/sq.ft
                case 'W-hr/sq.m':
                case 'kW-hr/sq.m':
                case 'MW-hr/sq.m':
                case 'MJ/sq.m':
                case 'BTU/hr/sq.m':
                case 'W/sq.m':
                case 'cd/sq.m':
                case 'MW/sq.m':
                case 'kW/sq.m':
                case 'kBTU/hr/sq.m':
                case 'kBTU/sq.m':
                case 'KBTU/sq.m':
                case 'BTU/sq.m':
                    value = (value / 10.7639);
                    break;
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'mL':
                case 'mL/s':
                case 'mL/min':
                    value = (value * 0.033814);
                    break;
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'mm':
                case 'mmHg':
                case 'dmm Hg':
                case 'mm/s':
                case 'mm/min':
                    value = (value * 0.0393701);
                    break;
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L - g, L - galUK
                case 'L':
                case 'L/s':
                case 'L/min':
                case 'L/hr':
                    value = (value * 0.264172);
                    break;
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'g':
                case 'g/s':
                case 'g/min':
                    value = (value * 0.035274);
                    break;
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'cm':
                case 'cm/wc':
                case 'cmHg':
                case 'dcm/wc':
                case 'dcm Hg':
                    value = (value * 0.393701);
                    break;
                // km - mile, km/s - mile/s, km/hr - mph
                case 'KM':
                case 'km':
                case 'km/s':
                case 'km/hr':
                    value = (value * 0.621369949);
                    break;
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'kg':
                case 'kg/min':
                case 'kg/hr':
                case 'kg/s':
                    value = (value / 0.453592);
                    break;
                // km/L - mile/gal
                case 'km/L':
                    value = (value * 2.352145572);
                    break;
                // ft/s - m/s, ft/min - m/min
                case 'm/s':
                case 'm/min':
                    value = (value * 0.30479999);
                    break;
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.m':
                case 'cu.m/min':
                case 'cu.m/hr':
                case 'cu.m/s':
                    value = (value * 35.3147);
                    break;
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/m':
                case '%obsc/m':
                    value = (value * 0.30479999);
                    break;
                // &microg/cu.m - oz/cu.ft
                case '&microg/cu.m':
                    value = (value * 0.000000000998848);
                    break;
                // mg/cu.m - oz/cu.ft
                case 'mg/cu.m':
                    value = (value * 0.000000998848);
                    break;
                // &microm - in
                case '&microm':
                    value = (value * 0.00003937);
                    break;
                // cu.mm - cu.in
                case 'cu.mm':
                    value = (value * 0.0000610237);
                    break;
                // Pa - psi
                case 'Pa':
                    value = (value * 0.000145038);
                    break;
                // MPa - psi
                case 'MPa':
                    value = (value * 145.038);
                    break;
                // kL - gal
                case 'kL':
                    value = (value * 264.172);
                    break;
                // g/cu.m - oz/cu.ft
                case 'g/cu.m':
                    value = (value * 0.000998848);
                    break;
                // sq.mm - sq.in
                case 'sq.mm':
                    value = (value * 0.00155);
                    break;
                // g/sq.m - oz/sq.ft
                case 'g/sq.m':
                    value = (value * 0.003277065);
                    break;
                // A/sq.m - A/sq.ft, J/sq.m - J/sq.ft
                case 'A/sq.m':
                case 'J/sq.m':
                    value = (value * 0.09290313);
                    break;
                // mg - grain
                case 'mg':
                    value = (value * 0.0154324);
                    break;
                // cu.cm - cu.in
                case 'cu.cm':
                    value = (value * 0.0610237);
                    break;
                // kg/cu.m - lb/cu.ft
                case 'kg/cu.m':
                    value = (value * 0.062427974);
                    break;
                // N/m - lbf/ft
                case 'N/m':
                    value = (value * 0.0685218);
                    break;
                // kPa - psi
                case 'kPa':
                    value = (value * 0.145038);
                    break;
                // sq.cm - sq.in
                // sq.cm - sq.inch
                case 'sq.cm':
                    value = (value * 0.155);
                    break;
                // kg/sq.m - lb/sq.ft
                case 'kg/sq.m':
                    value = (value * 0.204816098);
                    break;
                // N - lbf
                case 'N':
                    value = (value * 0.224809);
                    break;
                // sq.km - sq.mile
                case 'sq.km':
                    value = (value * 0.386102);
                    break;
                // N-m - lb-ft
                case 'N-m':
                    value = (value * 0.737562);
                    break;
                // Nm/sec - ft-lbs/sec
                case 'Nm/sec':
                    value = (value / 1.355818223);
                    break;
                // &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degC/hr':
                case '&degC/min':
                case '&degdaysC':
                case '&degC':
                case 'd&degC':
                    value = ((value * (9 / 5)) + 32);
                    break;
                // psi/&degC - psi/&degF
                case 'psi/&degC':
                    value = (1 / ((value * (9 / 5)) + 32));
                    break;
            }
        } else if (targetUnit === 'Metric') {
            switch (source) {
                // m/sq.s - ft/sq.s, m/s - ft/s, m/min - ft/min, m/hr - ft/hr, m - ft
                case 'ft/sq':
                case 'ft/s':
                case 'ft/min':
                case 'ft/hr':
                case 'ft':
                    value = (value / 3.28084);
                    break;
                // sq.m - sq.ft
                case 'sq.ft':
                    value = (value / 10.7639);
                    break;
                // sq.m - sq.yd
                case 'sq.yd':
                    value = (value * 0.836127);
                    break;
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft,  kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                case 'W-hr/sq.ft':
                case 'kW-hr/sq.ft':
                case 'MW-hr/sq.ft':
                case 'MJ/sq.ft':
                case 'BTU/hr/sq.ft':
                case 'W/sq.ft':
                case 'cd/sq.ft':
                case 'MW/sq.ft':
                case 'kW/sq.ft':
                case 'kBTU/hr/sq.ft':
                case 'kBTU/sq.ft':
                case 'KBTU/sq.ft':
                case 'BTU/sq.ft':
                    value = (value * 10.7639);
                    break;
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'fl oz':
                case 'fl oz/s':
                case 'fl oz/min':
                    value = (value / 0.033814);
                    break;
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'inHg':
                case 'din Hg':
                case 'in/s':
                case 'in/min':
                    value = (value / 0.0393701);
                    break;
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L/min - galUK/min, kL - gal
                case 'gal':
                case 'gal/s':
                case 'gal/min':
                case 'gal/hr':
                    value = (value / 0.264172);
                    break;
                // L - galUK
                // L/min - galUK/min
                case 'galUK':
                case 'galUK/min':
                    value = (value * 4.54609);
                    break;
                // km/L - mile/gal
                case 'mile/gal':
                    value = (value / 2.352145572);
                    break;
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'oz':
                case 'oz/s':
                case 'oz/min':
                    value = (value / 0.035274);
                    break;
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'in':
                case 'in/wc':
                case 'inHg':
                case 'din/wc':
                case 'din Hg':
                    value = (value / 0.393701);
                    break;
                // km - mile, km/s - mile/s, km/hr - mph
                case 'mile':
                case 'mile/s':
                case 'mph':
                    value = (value / 0.621369949);
                    break;
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'lb':
                case 'lb/min':
                case 'lb/hr':
                case 'lb/s':
                    value = (value * 0.453592);
                    break;
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.ft':
                case 'cu.ft/min':
                case 'cu.ft/hr':
                case 'cu.ft/s':
                    value = (value / 35.3147);
                    break;
                // cu.m - cu.yd
                case 'cu.yd':
                    value = (value * 0.764555);
                    break;
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/ft':
                case '%obsc/ft':
                    value = (value / 0.30479999);
                    break;
                // ft/s - m/s, ft/min - m/min
                case 'ft/s':
                case 'ft/min':
                    value = (value / 0.30479999);
                    break;
                // &microg/cu.m - oz/cu.ft, mg/cu.m - oz/cu.ft
                // &microg/cu.m - oz/cu.ft
                // mg/cu.m - oz/cu.ft
                // g/cu.m - oz/cu.ft
                case 'oz/cu.ft':
                    value = (value / 0.000000000998848);
                    break;
                // &microm - in
                // case 'in':
                // value = (value / 0.00003937);
                // break;
                // cu.mm - cu.in
                // cu.cm - cu.in
                case 'cu.in':
                    value = (value / 0.0000610237);
                    break;
                // Pa - psi, MPa - psi
                case 'psi':
                    value = (value / 0.145038);
                    break;
                // sq.mm - sq.in
                // sq.cm - sq.in
                case 'sq.in':
                    value = (value / 0.155);
                    break;
                // A/sq.m - A/sq.ft, J/sq.m - J/sq.ft
                case 'A/sq.ft':
                case 'J/sq.ft':
                    value = (value / 0.09290313);
                    break;
                // g/sq.m - oz/sq.ft
                case 'oz/sq.ft':
                    value = (value / 0.003277065);
                    break;
                // mg - grain
                case 'grain':
                    value = (value / 0.0154324);
                    break;
                // kg/cu.m - lb/cu.ft
                case 'lb/cu.ft':
                    value = (value / 0.062427974);
                    break;
                // N/m - lbf/ft
                case 'lbf/ft':
                    value = (value / 0.0685218);
                    break;
                // kPa - psi
                case 'psi':
                    value = (value / 0.145038);
                    break;
                // sq.cm - sq.inch
                case 'sq.inch':
                    value = (value / 0.155);
                    break;
                // kg/sq.m - lb/sq.ft
                case 'lb/sq.ft':
                    value = (value / 0.204816098);
                    break;
                // N - lbf
                case 'lbf':
                    value = (value / 0.224809);
                    break;
                // sq.km - sq.mile
                case 'sq.mile':
                    value = (value / 0.386102);
                    break;
                // N-m - lb-ft
                case 'lb-ft':
                    value = (value / 0.737562);
                    break;
                // hectare - acre
                case 'acre':
                    value = (value * 0.404686);
                    break;
                // N - lbf
                case 'lbf':
                    value = (value * 4.44822);
                    break;
                // m - ft
                case 'ft':
                    value = (value * 0.3048);
                    break;
                // m - yd
                case 'yd':
                    value = (value * 0.9144);
                    break;
                // L - qt
                case 'qt':
                    value = (value * 0.946353);
                    break;
                // L - pt
                case 'pt':
                    value = (value * 0.4731765);
                    break;
                // Nm/sec - ft-lbs/sec
                case 'ft-lbs/sec':
                    value = (value * 1.355818223);
                    break;
                // &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degF/hr':
                case '&degF/min':
                case '&degdaysF':
                case '&degF':
                case 'd&degF':
                    value = ((value - 32) / (9 / 5));
                    break;
                // psi/&degC - psi/&degF
                case 'psi/&degF':
                    value = ((value * (9 / 5)) + 32);
                    break;
                default:
                    // C - F, J-s, rpm, VA, VA-hr, kVA, kVA-hr, MVA, MVA-hr, F, ppu, ppm, ppb, g/kg, C, Ah, mAh, s, S, S/m, /s, /min, min,
                    // /hr, hr, A, A/sq.m, mA, V/m. V, mV, MV, kV, ohm, kohm, Mohm, mohm, ohm-m', GJ, W-hr, kW-hr, MW-hr, MBTU, hp-hr, cal,
                    // cal/g, therm, Dth, tR-hr, dkJ/kg, dBTU/lb, Hz, kHz, cph, cpm, MHz, %, %/s, k, K/s, K/hr, K/min, lx, klx, cd, H, b, B,
                    // cd/sq.ft, fc, b/s, B/s, Kb, KB, Kb/s, KB/s, Mb, MB, Mb/s, MB/s, Gb, GB, Gb/s, GB/s, Tb, TB, Tb/s, TB/s, N-s, ns, rad,
                    // ftcd, lm, Wb, T, t, ton, ton/hr, db, pf, pH, %RH, gH20/kgAir, V/K, sq.m/N, W/sq.mK, A sq.m, dBmV, dBuV, atm, psig,
                    // rad/s, rad/sq.s, &deg, &degph, kBTU/hr, kBTU, mW, MW, kW, GW, BTU, BTU/hr, BTU/lb, btu/lb, hp, tR, bar, hpa, mbar,
                    // torr, dPa, dkPa, dbar, datm, dpsi, dhpa, dmbar, dtorr, var, var_hr, kvar, kvar-hr, Mvar, Mvar-hr, sr, J, J/Kg, fnu
                    // J/sq.m, J/kgK, J/kg, J/g, J/K, KJ, kJ/Kg, kJ/K, MJ, MJ/Kg, MJ/K, N/m, dK, W/K, us, ms, cs, ds, day, wk, mo, yr, ntu
                    value = value;
            }
        }
        // return typeof value === 'string' ? value : Number(value).toFixed(3);
        return value;
    }

    convertUnitText(source: string, targetUnit?: string) {
        if (targetUnit != null) {
            return this._convertUnitText(source, targetUnit);
        } else {
            let target: string = this._convertUnitText(source, 'Imperial');
            if (target == null || source === target) {
                target =  this._convertUnitText(source, 'Metric');
            }
            return target;
        }
    }

    _convertUnitText(source: string, targetUnit: string) {
        if (targetUnit === 'Imperial') {
            switch (source) {
                // m/sq.s - ft/sq.s, m/s - ft/s,  - ft/min, m/hr - ft/hr, m - ft
                case 'm/sq.s':
                    return 'ft/sq.s';
                case 'm/s':
                    return 'ft/s';
                case 'm/min':
                    return 'ft/min';
                case 'm/hr':
                    return 'ft/hr';
                case 'm':
                    return 'ft';
                // sq.m - sq.ft
                // sq.m - sq.yd
                case 'sq.m':
                    return 'sq.ft';
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft, kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                case 'W-hr/sq.m':
                    return 'W-hr/sq.ft';
                case 'kW-hr/sq.m':
                    return 'kW-hr/sq.ft';
                case 'MW-hr/sq.m':
                    return 'MW-hr/sq.ft';
                case 'MJ/sq.m':
                    return 'MJ/sq.ft';
                case 'BTU/hr/sq.m':
                    return 'BTU/hr/sq.ft';
                case 'cd/sq.m':
                    return 'cd/sq.ft';
                case 'W/sq.m':
                    return 'W/sq.ft';
                case 'MW/sq.m':
                    return 'MW/sq.ft';
                case 'kW/sq.m':
                    return 'kW/sq.ft';
                case 'kBTU/hr/sq.m':
                    return 'kBTU/hr/sq.ft';
                case 'kBTU/sq.m':
                    return 'kBTU/sq.ft';
                case 'KBTU/sq.m':
                    return 'KBTU/sq.ft';
                case 'BTU/sq.m':
                    return 'BTU/sq.ft';
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'mL':
                    return 'fl oz';
                case 'mL/s':
                    return 'fl oz/s';
                case 'mL/min':
                    return 'fl oz/min';
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'mm':
                    return 'in';
                case 'mmHg':
                    return 'inHg';
                case 'dmm Hg':
                    return 'din Hg';
                case 'mm/s':
                    return 'in/s';
                case 'mm/min':
                    return 'in/min';
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L - g, L - galUK
                case 'L':
                    return 'gal';
                case 'L/s':
                    return 'gal/s';
                case 'L/min':
                    return 'gal/min';
                case 'L/hr':
                    return 'gal/hr';
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'g':
                    return 'oz';
                case 'g/s':
                    return 'oz/s';
                case 'g/min':
                    return 'oz/min';
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'cm':
                    return 'in';
                case 'cm/wc':
                    return 'in/wc';
                case 'cmHg':
                    return 'inHg';
                case 'dcm/wc':
                    return 'din/wc';
                case 'dcm Hg':
                    return 'din Hg';
                // km - mile, km/s - mile/s, km/hr - mph
                case 'KM':
                case 'km':
                    return 'mile';
                case 'km/s':
                    return 'mile/s';
                case 'km/hr':
                    return 'mph';
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'kg':
                    return 'lb';
                case 'kg/min':
                    return 'lb/min';
                case 'kg/hr':
                    return 'lb/hr';
                case 'kg/s':
                    return 'lb/s';
                // km/L - mile/gal
                case 'km/L':
                    return 'mile/gal';
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.m':
                    return 'cu.ft';
                case 'cu.m/min':
                    return 'cu.ft/min';
                case 'cu.m/hr':
                    return 'cu.ft/hr';
                case 'cu.m/s':
                    return 'cu.ft/s';
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/m':
                    return 'A/ft';
                // A/sq.m - A/sq.ft
                case 'A/sq.m':
                    return 'A/sq.ft';
                // J/sq.m - J/sq.ft
                case 'J/sq.m':
                    return 'J/sq.ft';
                case '%obsc/m':
                    return '%obsc/ft';
                // m/s - ft/s, m/min - ft/min
                case 'm/s':
                    return 'ft/s';
                case 'm/min':
                    return 'ft/min';
                // &microg/cu.m - oz/cu.ft
                case '&microg/cu.m':
                    return 'oz/cu.ft';
                // mg/cu.m - oz/cu.ft
                case 'mg/cu.m':
                    return 'oz/cu.ft';
                // &microm - in
                case '&microm':
                    return 'in';
                // cu.mm - cu.in
                case 'cu.mm':
                    return 'cu.in';
                // Pa - psi
                case 'Pa':
                    return 'psi';
                // MPa - psi
                case 'MPa':
                    return 'psi';
                // kL - gal
                case 'kL':
                    return 'gal';
                // g/cu.m - oz/cu.ft
                case 'g/cu.m':
                    return 'oz/cu.ft';
                // sq.mm - sq.in
                case 'sq.mm':
                    return 'sq/in';
                // g/sq.m - oz/sq.ft
                case 'g/sq.m':
                    return 'oz/sq.ft';
                // mg - grain
                case 'mg':
                    return 'grain';
                // cu.cm - cu.in
                case 'cu.cm':
                    return 'cu.in';
                // kg/cu.m - lb/cu.ft
                case 'kg/cu.m':
                    return 'lb/cu.ft';
                // N/m - lbf/ft
                case 'N/m':
                    return 'lbf/ft';
                // kPa - psi
                case 'kPa':
                    return 'psi';
                // sq.cm - sq.in
                // sq.cm - sq.inch
                case 'sq.cm':
                    return 'sq.in';
                // kg/sq.m - lb/sq.ft
                case 'kg/sq.m':
                    return 'lb/sq.ft';
                // N - lbf
                case 'N':
                    return 'lbf';
                // sq.km - sq.mile
                case 'sq.km':
                    return 'sq.mile';
                // N-m - lb-ft
                case 'N-m':
                    return 'lb-ft';
                // Nm/sec - ft-lbs/sec
                case 'Nm/sec':
                    return 'ft-lbs/sec';
                // &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degC/hr':
                    return '&degF/hr';
                case '&degC/min':
                    return '&degF/min';
                case '&degdaysC':
                    return '&degdaysF';
                case '&degC':
                    return '&degF';
                case 'd&degC':
                    return 'd&degF';
                // psi/&degC - psi/&degF
                case 'psi/&degC':
                    return 'psi/&degF';
            }
        } else if (targetUnit === 'Metric') {
            switch (source) {
                // m/sq.s - ft/sq.s, m/s - ft/s, m/min - ft/min, m/hr - ft/hr, m - ft
                case 'ft/sq':
                    return 'm/sq.s';
                case 'ft/s':
                    return 'm/s';
                case 'ft/min':
                    return 'm/min';
                case 'ft/hr':
                    return 'm/hr';
                case 'ft':
                    return 'm';
                // sq.m - sq.ft
                case 'sq.ft':
                    return 'sq.m';
                // sq.m - sq.yd
                case 'sq.yd':
                    return 'sq.m';
                // W-hr/sq.m - W-hr/sq.ft, kW-hr/sq.m - kW-hr/sq.ft, kW/sq.m - kW/sq.ft, MW-hr/sq.m - MW-hr/sq.ft, MJ/sq.m - MJ/sq.ft,
                // BTU/hr/sq.m - BTU/hr/sq.ft, W/sq.m - W/sq.ft, MW/sq.m - MW/sq.ft, kBTU/hr/sq.m - kBTU/hr/sq.ft, KBTU/sq.m - KBTU/sq.ft
                case 'W-hr/sq.ft':
                    return 'W-hr/sq.m';
                case 'kW-hr/sq.ft':
                    return 'kW-hr/sq.m';
                case 'MW-hr/sq.ft':
                    return 'MW-hr/sq.m';
                case 'MJ/sq.ft':
                    return 'MJ/sq.m';
                case 'BTU/hr/sq.ft':
                    return 'BTU/hr/sq.m';
                case 'cd/sq.ft':
                    return 'cd/sq.m';
                case 'W/sq.ft':
                    return 'W/sq.m';
                case 'MW/sq.ft':
                    return 'MW/sq.m';
                case 'kW/sq.ft':
                    return 'kW/sq.m';
                case 'kBTU/hr/sq.ft':
                    return 'kBTU/hr/sq.m';
                case 'kBTU/sq.ft':
                    return 'kBTU/sq.m';
                case 'KBTU/sq.ft':
                    return 'KBTU/sq.m';
                case 'BTU/sq.ft':
                    return 'BTU/sq.m';
                // mL - fl oz, mL/s - fl oz/s, mL/min - fl oz/min
                case 'fl oz':
                    return 'mL';
                case 'fl oz/s':
                    return 'mL/s';
                case 'fl oz/min':
                    return 'mL/min';
                // mm - in, mmHg - inHg, dmm Hg - din Hg, mm/s - in/s, mm/min - in/min
                case 'inHg':
                    return 'mmHg';
                case 'din Hg':
                    return 'dmm Hg';
                case 'in/s':
                    return 'mm/s';
                case 'in/min':
                    return 'mm/min';
                // L - gal, L/s - gal/s, L/min - gal/min, L/hr - gal/hr, L/min - galUK/min, kL - gal
                case 'gal':
                    return 'L';
                case 'gal/s':
                    return 'L/s';
                case 'gal/min':
                    return 'L/min';
                case 'gal/hr':
                    return 'L/hr';
                case 'galUK/min':
                    return 'L/min';
                // L - galUK
                // L/min - galUK/min
                case 'galUK':
                    return 'L';
                case 'galUK/min':
                    return 'L/min';
                // km/L - mile/gal
                case 'mile/gal':
                    return 'km/L';
                // g - oz, g/s - oz/s, g/min - oz/min
                case 'oz':
                    return 'g';
                case 'oz/s':
                    return 'g/s';
                case 'oz/min':
                    return 'g/min';
                // cm - in, cm/wc - in/wc, cmHg - inHg, dcm/wc - din/wc, dcm Hg - din Hg
                case 'in':
                    return 'cm';
                case 'in/wc':
                    return 'cm/wc';
                case 'inHg':
                    return 'cmHg';
                case 'din/wc':
                    return 'dcm/wc';
                case 'din Hg':
                    return 'dcm Hg';
                // km - mile, km/s - mile/s, km/hr - mph
                case 'mile':
                    return 'km';
                case 'mile/s':
                    return 'km/s';
                case 'mph':
                    return 'km/hr';
                // kg - lb, kg/min - lb/min, kg/hr - lb/hr, kg/s - lb/s
                case 'lb':
                    return 'kg';
                case 'lb/min':
                    return 'kg/min';
                case 'lb/hr':
                    return 'kg/hr';
                case 'lb/s':
                    return 'kg/s';
                // cu.m - cu.ft, cu.m/s - cu.ft/s, cu.m/min - cu.ft/min, cu.m/hr - cu.ft/hr
                case 'cu.ft':
                    return 'cu.m';
                case 'cu.ft/min':
                    return 'cu.m/min';
                case 'cu.ft/hr':
                    return 'cu.m/hr';
                case 'cu.ft/s':
                    return 'cu.m/s';
                // cu.m - cu.yd
                case 'cu.yd':
                    return 'cu.m';
                // A/m - A/ft, %obsc/m - %obsc/ft
                case 'A/ft':
                    return 'A/m';
                case '%obsc/ft':
                    return '%obsc/m';
                // ft/s - m/s, ft/min - m/min
                case 'ft/s':
                    return '%obsc/ft';
                case 'ft/min':
                    return '%obsc/ft';
                // &microg/cu.m - oz/cu.ft, mg/cu.m - oz/cu.ft, g/cu.m - oz/cu.ft
                case 'oz/cu.ft':
                    return '&microg/cu.m';
                // &microm - in
                // case 'in':
                // return '&microm';
                // cu.mm - cu.in
                // cu.cm - cu.in
                case 'cu.in':
                    return 'cu.mm';
                // Pa - psi, MPa - psi
                case 'psi':
                    return 'kPa';
                // sq.mm - sq.in
                // sq.cm - sq.in
                case 'sq.in':
                    return 'sq.cm';
                // g/sq.m - oz/sq.ft
                case 'oz/sq.ft':
                    return 'g/sq.m';
                // mg - grain
                case 'grain':
                    return 'mg';
                // kg/cu.m - lb/cu.ft
                case 'lb/cu.ft':
                    return 'kg/cu.m';
                // N/m - lbf/ft
                case 'lbf/ft':
                    return 'N/m';
                // kPa - psi
                case 'psi':
                    return 'kPa';
                // sq.cm - sq.inch
                case 'sq.inch':
                    return 'sq.cm';
                // kg/sq.m - lb/sq.ft
                case 'lb/sq.ft':
                    return 'kg/sq.m';
                // A/sq.m - A/sq.ft
                case 'A/sq.ft':
                    return 'A/sq.m';
                // J/sq.m - J/sq.ft
                case 'J/sq.ft':
                    return 'J/sq.m';
                // N - lbf
                case 'lbf':
                    return 'N';
                // sq.km - sq.mile
                case 'sq.mile':
                    return 'sq.km';
                // N-m - lb-ft
                case 'lb-ft':
                    return 'N-m';
                // hectare - acre
                case 'acre':
                    return 'hectare';
                // N - lbf
                case 'lbf':
                    return 'N';
                // m - ft
                case 'ft':
                    return 'm';
                // m - yd
                case 'yd':
                    return 'm';
                // L - qt
                case 'qt':
                    return 'L';
                // L - pt
                case 'pt':
                    return 'L';
                // Nm/sec - ft-lbs/sec
                case 'ft-lbs/sec':
                    return 'Nm/sec';
                // C - F, &degC/hr - &degF/hr, &degC/min - &degF/min, &degdaysC - &degdaysF, &degC - &degF, d&degC - d&degF
                case '&degF/hr':
                    return '&degC/hr';
                case '&degF/min':
                    return '&degC/min';
                case '&degdaysF':
                    return '&degdaysC';
                case '&degF':
                    return '&degC';
                case 'd&degF':
                    return 'd&degC';
                // psi/&degC - psi/&degF
                case 'psi/&degF':
                    return 'psi/&degC';
            }
        }
        return source;
    }
}
