import { Integer, SafeIntegerRange } from "../deps.ts";

export class Angle {
  #degrees: Angle.Degrees;

  private constructor(degrees: Angle.Degrees) {
    this.#degrees = Angle.normalizeDegrees(degrees);
    Object.freeze(this);
  }

  static ofDegrees(degrees: Angle.Degrees): Angle {
    return new Angle(degrees);
  }

  static ofRadians(radians: Angle.Radians): Angle {
    return new Angle(Angle.radiansToDegrees(radians));
  }

  toDegrees(): Angle.Degrees {
    return this.#degrees;
  }

  toRadians(): Angle.Radians {
    return Angle.degreesToRadians(this.#degrees);
  }

  toDmsString(options?: Angle.DmsOptions): string { //TODO test
    return Angle.degreesToDmsString(this.#degrees, options);
  }

  valueOf(): number {
    return this.#degrees;
  }
}

export namespace Angle {
  export type Degrees = number;

  export namespace Degrees {
    export const ZERO_TURN = 0;
    export const ONE_TURN = 360;
  }

  export type Radians = number;

  export type Gradians = number;

  export type Turns = number;

  export function normalizeDegrees(degrees: Degrees): Degrees {
    if (Number.isFinite(degrees)) {
      const t = degrees % Degrees.ONE_TURN;
      return (t < Degrees.ZERO_TURN) ? (t + Degrees.ONE_TURN) : t;
    }
    throw new TypeError("degrees");
  }

  export function radiansToDegrees(radians: Radians): Degrees {
    if (Number.isFinite(radians)) {
      const degrees = radians * (180 / Math.PI);
      return normalizeDegrees(degrees);
    }
    throw new TypeError("radians");
  }

  export function degreesToRadians(degrees: Degrees): Radians {
    if (Number.isFinite(degrees)) {
      return normalizeDegrees(degrees) * (Math.PI / 180);
    }
    throw new TypeError("degrees");
  }

  export function gradiansToDegrees(gradians: Gradians): Degrees {
    if (Number.isFinite(gradians)) {
      const degrees = gradians * (180 / 200);
      return normalizeDegrees(degrees);
    }
    throw new TypeError("gradians");
  }

  //TODO degreesToGradians

  export function turnsToDegrees(turns: Turns): Degrees {
    if (Number.isFinite(turns)) {
      const degrees = turns * 360;
      return normalizeDegrees(degrees);
    }
    throw new TypeError("turns");
  }

  //TODO degreesToTurns

  export const DmsStringPrecision = {
    AUTO: "auto",
    DEGREE: "degree",
    MINUTE: "minute",
    SECOND: "second",
    // MILLISECOND → SecondFractionDigits:3
    // MICROSECOND → SecondFractionDigits:6
  } as const;
  export type DmsStringPrecision =
    typeof DmsStringPrecision[keyof typeof DmsStringPrecision];

  export type DmsStringSecondFractionDigits = 0 | 1 | 2 | 3 | 4 | 5 | 6;

  function _resolveDmsStringSecondFractionDigits(value?: number) {
    let adjustedValue = Number.isFinite(value) ? value as number : 0;
    adjustedValue = Integer.roundNumber(
      adjustedValue,
      Integer.RoundingMode.TRUNCATE,
    );
    const range = SafeIntegerRange.of<DmsStringSecondFractionDigits>(0, 6);
    return range.clamp(adjustedValue);
  }

  export type DmsOptions = {
    precision?: DmsStringPrecision;
    secondFractionDigits?: DmsStringSecondFractionDigits;
  };

  export function degreesToDmsString(
    degrees: Degrees,
    options?: DmsOptions,
  ): string {
    if (Number.isFinite(degrees) !== true) {
      throw new TypeError("degrees");
    }

    const precision = Object.values(DmsStringPrecision).includes(
        options?.precision as DmsStringPrecision,
      )
      ? options?.precision
      : DmsStringPrecision.SECOND;
    const normalizedDegrees = normalizeDegrees(degrees);
    const dInt = Math.trunc(normalizedDegrees);

    let dStr: string;
    if (
      (precision === DmsStringPrecision.DEGREE) ||
      ((precision === DmsStringPrecision.AUTO) &&
        (dInt === normalizedDegrees))
    ) {
      dStr = Math.round(normalizedDegrees).toString(10);
      return `${dStr}°`;
    } else {
      dStr = dInt.toString(10);
    }

    const msNum = (normalizedDegrees - dInt) * 60;
    const mInt = Math.trunc(msNum);

    let mStr: string;
    if (
      (precision === DmsStringPrecision.MINUTE) ||
      ((precision === DmsStringPrecision.AUTO) && (mInt === msNum))
    ) {
      mStr = Math.round(msNum).toString(10).padStart(2, "0");
      return `${dStr}°${mStr}′`;
    } else {
      mStr = mInt.toString(10).padStart(2, "0");
    }

    const sNum = (msNum - mInt) * 60;
    const sInt = Math.trunc(sNum);

    const secondFractionDigits = _resolveDmsStringSecondFractionDigits(
      options?.secondFractionDigits,
    );

    const sStr = ((sInt < 10) ? "0" : "") +
      sNum.toFixed(secondFractionDigits);
    return `${dStr}°${mStr}′${sStr}″`;
  }
}
