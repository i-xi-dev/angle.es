import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Angle } from "../mod.ts";

Deno.test("Angle.Degrees.normalize()", () => {
  assertStrictEquals(Angle.Degrees.normalize(0), 0);
  assertStrictEquals(Angle.Degrees.normalize(360), 0);
  assertStrictEquals(Angle.Degrees.normalize(1), 1);
  assertStrictEquals(Angle.Degrees.normalize(0.1), 0.1);
  assertStrictEquals(Angle.Degrees.normalize(359), 359);
  assertStrictEquals(Angle.Degrees.normalize(359.9), 359.9);

  assertThrows(
    () => {
      Angle.Degrees.normalize("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});

Deno.test("Angle.Degrees.fromRadians()", () => {
  assertStrictEquals(Angle.Degrees.fromRadians(0), 0);
  assertStrictEquals(Angle.Degrees.fromRadians(Math.PI * 2), 0);
  assertStrictEquals(Angle.Degrees.fromRadians(Math.PI), 180);
  assertStrictEquals(Angle.Degrees.fromRadians(Math.PI / 2), 90);
  assertStrictEquals(
    Angle.Degrees.fromRadians((Math.PI * 2) + (Math.PI / 2)),
    90,
  );

  assertThrows(
    () => {
      Angle.Degrees.fromRadians("0" as unknown as number);
    },
    TypeError,
    undefined,
    "radians",
  );
});

Deno.test("Angle.Degrees.toRadians()", () => {
  assertStrictEquals(Angle.Degrees.toRadians(0), 0);
  assertStrictEquals(Angle.Degrees.toRadians(360), 0);
  assertStrictEquals(Angle.Degrees.toRadians(180), Math.PI);
  assertStrictEquals(Angle.Degrees.toRadians(90), Math.PI / 2);
  assertStrictEquals(Angle.Degrees.toRadians(450), Math.PI / 2);

  assertThrows(
    () => {
      Angle.Degrees.toRadians("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});
