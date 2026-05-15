package com.merabp.healthcare.model;

public enum ObservationCode {

    //                        unit1    unit2    v1Min   v1Max   v2Min   v2Max
    HEART_RATE    ("bpm",     null,    40.0,   200.0,   null,   null),
    BLOOD_PRESSURE("mmHg",   "mmHg",  60.0,   200.0,   40.0,  130.0),  // systolic / diastolic
    BLOOD_GLUCOSE ("mg/dL",   null,   40.0,   500.0,   null,   null),
    HBA1C         ("%",       null,    3.0,    15.0,    null,   null);

    private final String unit1;
    private final String unit2;     // null for single-value codes
    private final Double value1Min;
    private final Double value1Max;
    private final Double value2Min; // null for single-value codes
    private final Double value2Max;

    ObservationCode(String unit1, String unit2,
                    Double value1Min, Double value1Max,
                    Double value2Min, Double value2Max) {
        this.unit1      = unit1;
        this.unit2      = unit2;
        this.value1Min  = value1Min;
        this.value1Max  = value1Max;
        this.value2Min  = value2Min;
        this.value2Max  = value2Max;
    }

    /** True only for BLOOD_PRESSURE */
    public boolean requiresValue2() {
        return value2Min != null;
    }

    /** True only for BLOOD_GLUCOSE — context (FASTING / POST_PRANDIAL) is mandatory */
    public boolean requiresContext() {
        return this == BLOOD_GLUCOSE;
    }

    public boolean isValue1InRange(Double value) {
        return value != null && value >= value1Min && value <= value1Max;
    }

    public boolean isValue2InRange(Double value) {
        return value2Min != null && value != null && value >= value2Min && value <= value2Max;
    }

    public String getUnit1()      { return unit1; }
    public String getUnit2()      { return unit2; }
    public Double getValue1Min()  { return value1Min; }
    public Double getValue1Max()  { return value1Max; }
    public Double getValue2Min()  { return value2Min; }
    public Double getValue2Max()  { return value2Max; }
}