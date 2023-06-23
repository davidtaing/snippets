/**
 * DESCRIPTION:
 * Union Type + Switch Statement
 *
 * Assigning the expression to a never variable will cause the compiler
 * to throw an error if the switch statement is not exhaustive.
 *
 * SOURCE:
 * Deep Dive into Advanced TypeScript: A Live Coding Expedition - Christian Woerz - NDC Oslo 2023
 * Start: https://youtu.be/5woZK_3z25U?t=896
 * End: https://youtu.be/5woZK_3z25U?t=1094
 */

type Locations = "Zurich" | "Oslo" | "London";

function getCountryForLocations(location: Locations): string {
  switch (location) {
    // Commenting out one of these will cause a compile time error
    case "Zurich":
      return "Switzerland";
    case "Oslo":
      return "Norway";
    case "London":
      return "England";
    default:
      const exhaustive: never = location;
      throw new Error(`${location} is not known`);
  }
}
