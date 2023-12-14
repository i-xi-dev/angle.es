import { SafeInteger } from "../deps.ts";

class Angle {
  #degrees: Angle.Degrees;

  private constructor(degrees: Angle.Degrees) {
    this.#degrees = Angle.Degrees.normalize(degrees);
    Object.freeze(this);
  }

  static ofDegrees(degrees: Angle.Degrees): Angle {
    return new Angle(degrees);
  }

  static ofRadians(radians: Angle.Radians): Angle {
    return new Angle(Angle.Degrees.fromRadians(radians));
  }

  toDegrees(): Angle.Degrees {
    return this.#degrees;
  }

  toRadians(): Angle.Radians {
    return Angle.Degrees.toRadians(this.#degrees);
  }

  valueOf(): number {
    return this.toDegrees();
  }
}

namespace Angle {
  export type Degrees = number;

  export namespace Degrees {
    const ZERO_TURN = 0;
    const ONE_TURN = 360;

    export function normalize(degrees: Degrees): Degrees {
      if (Number.isFinite(degrees)) {
        const t = degrees % ONE_TURN;
        return (t < ZERO_TURN) ? (t + ONE_TURN) : t;
      }
      throw new TypeError("degrees");
    }

    export function fromRadians(radians: Radians): Degrees {
      if (Number.isFinite(radians)) {
        const degrees = radians * (180 / Math.PI);
        return normalize(degrees);
      }
      throw new TypeError("radians");
    }

    export function toRadians(degrees: Degrees): Radians {
      if (Number.isFinite(degrees)) {
        return normalize(degrees) * (Math.PI / 180);
      }
      throw new TypeError("degrees");
    }

    export function fromGradians(gradians: Gradians): Degrees {
      if (Number.isFinite(gradians)) {
        const degrees = gradians * (180 / 200);
        return normalize(degrees);
      }
      throw new TypeError("gradians");
    }

    export function fromTurns(turns: Turns): Degrees {
      if (Number.isFinite(turns)) {
        const degrees = turns * 360;
        return normalize(degrees);
      }
      throw new TypeError("turns");
    }

    export function toDmsString(
      degrees: Degrees,
      options?: DmsOptions,
    ): string {
      if (Number.isFinite(degrees) !== true) {
        throw new TypeError("degrees");
      }

      const precision = Object.values(DmsOptions.Precision).includes(
          options?.precision as DmsOptions.Precision,
        )
        ? options?.precision
        : DmsOptions.Precision.SECOND;
      const normalizedDegrees = normalize(degrees);
      const dInt = Math.trunc(normalizedDegrees);

      let dStr: string;
      if (
        (precision === DmsOptions.Precision.DEGREE) ||
        ((precision === DmsOptions.Precision.AUTO) &&
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
        (precision === DmsOptions.Precision.MINUTE) ||
        ((precision === DmsOptions.Precision.AUTO) && (mInt === msNum))
      ) {
        mStr = Math.round(msNum).toString(10).padStart(2, "0");
        return `${dStr}°${mStr}′`;
      } else {
        mStr = mInt.toString(10).padStart(2, "0");
      }

      const sNum = (msNum - mInt) * 60;
      const sInt = Math.trunc(sNum);

      const secondFractionDigits = SafeInteger.fromNumber(
        options?.secondFractionDigits,
        {
          fallback: 0,
          roundingMode: SafeInteger.RoundingMode.TRUNCATE,
          lowerLimit: 0,
          upperLimit: 6,
        },
      );

      const sStr = ((sInt < 10) ? "0" : "") +
        sNum.toFixed(secondFractionDigits);
      return `${dStr}°${mStr}′${sStr}″`;
    }

    export type DmsOptions = {
      precision?: DmsOptions.Precision;
      secondFractionDigits?: DmsOptions.SecondFractionDigits;
    };

    export namespace DmsOptions {
      export const Precision = {
        AUTO: "auto",
        DEGREE: "degree",
        MINUTE: "minute",
        SECOND: "second",
      } as const;
      export type Precision = typeof Precision[keyof typeof Precision];

      export type SecondFractionDigits = 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }
  }

  export type Radians = number;

  // export namespace Radians {
  //   export function format(radians: Radians): string {
  //     return `${ radians } rad`; 桁区切りはSI単位としては","でなく" "。→ 基本的には" rad"を後置すればいいだけなので実装しない
  //   }
  // }

  export type Gradians = number;

  export type Turns = number;
}

export { Angle };
