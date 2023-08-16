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
        return normalize(360) * (Math.PI / 180);
      }
      throw new TypeError("degrees");
    }
  }

  export type Radians = number;
}

export { Angle };
