import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Angle } from "../mod.ts";

Deno.test("Angle.ofDegrees()", () => {
  assertStrictEquals(Angle.ofDegrees(0).toDegrees(), 0);
  assertStrictEquals(Angle.ofDegrees(360).toDegrees(), 0);
  assertStrictEquals(Angle.ofDegrees(1).toDegrees(), 1);
  assertStrictEquals(Angle.ofDegrees(0.1).toDegrees(), 0.1);
  assertStrictEquals(Angle.ofDegrees(359).toDegrees(), 359);
  assertStrictEquals(Angle.ofDegrees(359.9).toDegrees(), 359.9);

  assertThrows(
    () => {
      Angle.ofDegrees("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});

Deno.test("Angle.ofRadians()", () => {
  assertStrictEquals(Angle.ofRadians(0).toDegrees(), 0);
  assertStrictEquals(Angle.ofRadians(Math.PI * 2).toDegrees(), 0);
  assertStrictEquals(Angle.ofRadians(Math.PI).toDegrees(), 180);
  assertStrictEquals(Angle.ofRadians(Math.PI / 2).toDegrees(), 90);
  assertStrictEquals(
    Angle.ofRadians((Math.PI * 2) + (Math.PI / 2)).toDegrees(),
    90,
  );

  assertThrows(
    () => {
      Angle.ofRadians("0" as unknown as number);
    },
    TypeError,
    undefined,
    "radians",
  );
});

// Angle.prototype.toDegrees → 他でテスト済

Deno.test("Angle.prototype.toRadians()", () => {
  assertStrictEquals(Angle.ofDegrees(0).toRadians(), 0);
  assertStrictEquals(Angle.ofDegrees(360).toRadians(), 0);
  assertStrictEquals(Angle.ofDegrees(180).toRadians(), Math.PI);
  assertStrictEquals(Angle.ofDegrees(90).toRadians(), Math.PI / 2);
  assertStrictEquals(Angle.ofDegrees(450).toRadians(), Math.PI / 2);
});

Deno.test("Angle.prototype.toDmsString()", () => {
  const o3x = {
    secondFractionDigits: 1,
    precision: "" as Angle.DmsStringPrecision,
  } as const;
  assertStrictEquals(Angle.ofDegrees(0).toDmsString(o3x), "0°00′00.0″");
});

Deno.test("Angle.prototype.valueOf()", () => {
  assertStrictEquals(Angle.ofDegrees(0).valueOf(), 0);
  assertStrictEquals(Angle.ofDegrees(360).valueOf(), 0);
  assertStrictEquals(Angle.ofDegrees(1).valueOf(), 1);
  assertStrictEquals(Angle.ofDegrees(0.1).valueOf(), 0.1);
  assertStrictEquals(Angle.ofDegrees(359).valueOf(), 359);
  assertStrictEquals(Angle.ofDegrees(359.9).valueOf(), 359.9);
});
