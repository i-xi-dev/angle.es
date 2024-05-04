import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Angle } from "../mod.ts";

Deno.test("Angle.normalizeDegrees()", () => {
  assertStrictEquals(Angle.normalizeDegrees(0), 0);
  assertStrictEquals(Angle.normalizeDegrees(360), 0);
  assertStrictEquals(Angle.normalizeDegrees(1), 1);
  assertStrictEquals(Angle.normalizeDegrees(0.1), 0.1);
  assertStrictEquals(Angle.normalizeDegrees(359), 359);
  assertStrictEquals(Angle.normalizeDegrees(359.9), 359.9);
  assertStrictEquals(
    Angle.normalizeDegrees(360.1).toFixed(6),
    (0.1).toFixed(6),
  ); // JSの精度の問題
  assertStrictEquals(Angle.normalizeDegrees(-0.1), 359.9);

  assertThrows(
    () => {
      Angle.normalizeDegrees("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});

Deno.test("Angle.radiansToDegrees()", () => {
  assertStrictEquals(Angle.radiansToDegrees(0), 0);
  assertStrictEquals(Angle.radiansToDegrees(Math.PI * 2), 0);
  assertStrictEquals(Angle.radiansToDegrees(Math.PI), 180);
  assertStrictEquals(Angle.radiansToDegrees(Math.PI / 2), 90);
  assertStrictEquals(
    Angle.radiansToDegrees((Math.PI * 2) + (Math.PI / 2)),
    90,
  );

  assertThrows(
    () => {
      Angle.radiansToDegrees("0" as unknown as number);
    },
    TypeError,
    undefined,
    "radians",
  );
});

Deno.test("Angle.degreesToRadians()", () => {
  assertStrictEquals(Angle.degreesToRadians(0), 0);
  assertStrictEquals(Angle.degreesToRadians(360), 0);
  assertStrictEquals(Angle.degreesToRadians(180), Math.PI);
  assertStrictEquals(Angle.degreesToRadians(90), Math.PI / 2);
  assertStrictEquals(Angle.degreesToRadians(450), Math.PI / 2);

  assertThrows(
    () => {
      Angle.degreesToRadians("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});

Deno.test("Angle.degreesToDmsString(number)", () => {
  assertStrictEquals(Angle.degreesToDmsString(0), "0°00′00″");
  assertStrictEquals(Angle.degreesToDmsString(1234567890), "90°00′00″");
  assertStrictEquals(Angle.degreesToDmsString(0.1), "0°06′00″");
  assertStrictEquals(Angle.degreesToDmsString(0.5), "0°30′00″");
  assertStrictEquals(Angle.degreesToDmsString(0.9), "0°54′00″");
  assertStrictEquals(Angle.degreesToDmsString(1.23), "1°13′48″");
  assertStrictEquals(Angle.degreesToDmsString(1.234), "1°14′02″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563), "6°51′23″");

  assertThrows(
    () => {
      Angle.degreesToDmsString("0" as unknown as number);
    },
    TypeError,
    undefined,
    "degrees",
  );
});

Deno.test("Angle.degreesToDmsString(number, {})", () => {
  const o1 = { secondFractionDigits: 0, precision: "auto" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o1), "0°");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o1), "90°");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o1), "0°06′");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o1), "0°30′");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o1), "0°54′");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o1), "1°13′48″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o1), "1°14′02″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o1), "1°14′04″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o1), "6°51′23″");

  const o2 = {
    secondFractionDigits: 10 as Angle.DmsStringSecondFractionDigits,
    precision: "auto",
  } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o2), "0°");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o2), "90°");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o2), "0°06′");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o2), "0°30′");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o2), "0°54′");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o2), "1°13′48.000000″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o2), "1°14′02.400000″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o2), "1°14′04.416000″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o2), "6°51′22.680000″");

  const o3 = { secondFractionDigits: 1, precision: "auto" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3), "0°");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3), "90°");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3), "0°06′");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3), "0°30′");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3), "0°54′");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3), "1°13′48.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3), "1°14′02.4″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3), "1°14′04.4″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3), "6°51′22.7″");

  const o3x = {
    secondFractionDigits: 1,
    precision: "" as Angle.DmsStringPrecision,
  } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3x), "0°00′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3x), "90°00′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3x), "0°06′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3x), "0°30′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3x), "0°54′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3x), "1°13′48.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3x), "1°14′02.4″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3x), "1°14′04.4″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3x), "6°51′22.7″");

  const o3b = { secondFractionDigits: 1, precision: "auto" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3b), "0°");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3b), "90°");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3b), "0°06′");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3b), "0°30′");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3b), "0°54′");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3b), "1°13′48.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3b), "1°14′02.4″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3b), "1°14′04.4″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3b), "6°51′22.7″");

  const o3c = { secondFractionDigits: 1, precision: "second" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3c), "0°00′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3c), "90°00′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3c), "0°06′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3c), "0°30′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3c), "0°54′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3c), "1°13′48.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3c), "1°14′02.4″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3c), "1°14′04.4″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3c), "6°51′22.7″");

  const o3cx = { secondFractionDigits: 1 } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3cx), "0°00′00.0″");
  assertStrictEquals(
    Angle.degreesToDmsString(1234567890, o3cx),
    "90°00′00.0″",
  );
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3cx), "0°06′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3cx), "0°30′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3cx), "0°54′00.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3cx), "1°13′48.0″");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3cx), "1°14′02.4″");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3cx), "1°14′04.4″");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3cx), "6°51′22.7″");

  const o3d = { secondFractionDigits: 1, precision: "minute" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3d), "0°00′");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3d), "90°00′");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3d), "0°06′");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3d), "0°30′");
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3d), "0°54′");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3d), "1°14′"); // 13.8なので
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3d), "1°14′");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3d), "1°14′");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3d), "6°51′");

  const o3e = { secondFractionDigits: 1, precision: "degree" } as const;
  assertStrictEquals(Angle.degreesToDmsString(0, o3e), "0°");
  assertStrictEquals(Angle.degreesToDmsString(1234567890, o3e), "90°");
  assertStrictEquals(Angle.degreesToDmsString(0.1, o3e), "0°");
  assertStrictEquals(Angle.degreesToDmsString(0.5, o3e), "1°"); // 0.5なので
  assertStrictEquals(Angle.degreesToDmsString(0.9, o3e), "1°");
  assertStrictEquals(Angle.degreesToDmsString(1.23, o3e), "1°");
  assertStrictEquals(Angle.degreesToDmsString(1.234, o3e), "1°");
  assertStrictEquals(Angle.degreesToDmsString(1.23456, o3e), "1°");
  assertStrictEquals(Angle.degreesToDmsString(6.8563, o3e), "7°");
});

Deno.test("Angle.gradiansToDegrees()", () => {
  assertStrictEquals(Angle.gradiansToDegrees(0), 0);
  assertStrictEquals(Angle.gradiansToDegrees(400), 0);
  assertStrictEquals(Angle.gradiansToDegrees(200), 180);
  assertStrictEquals(Angle.gradiansToDegrees(100), 90);
  assertStrictEquals(
    Angle.gradiansToDegrees(400 + 100),
    90,
  );

  assertThrows(
    () => {
      Angle.gradiansToDegrees("0" as unknown as number);
    },
    TypeError,
    undefined,
    "radians",
  );
});

Deno.test("Angle.turnsToDegrees()", () => {
  assertStrictEquals(Angle.turnsToDegrees(0), 0);
  assertStrictEquals(Angle.turnsToDegrees(1), 0);
  assertStrictEquals(Angle.turnsToDegrees(0.5), 180);
  assertStrictEquals(Angle.turnsToDegrees(0.25), 90);
  assertStrictEquals(
    Angle.turnsToDegrees(1 + 0.25),
    90,
  );

  assertThrows(
    () => {
      Angle.turnsToDegrees("0" as unknown as number);
    },
    TypeError,
    undefined,
    "radians",
  );
});
