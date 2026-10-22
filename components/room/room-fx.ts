export type RoomLights = "on" | "party";
export type RoomWeather = "none" | "barcelona" | "utrecht";

export type RoomFx = {
  lights: RoomLights;
  weather: RoomWeather;
  konami: boolean;
  sandwich: boolean;
  coffeeUntil: number;
  celebrateUntil: number;
  meltUntil: number;
  catToken: number;
};

export type RoomAction =
  | { type: "weather"; place: Exclude<RoomWeather, "none"> }
  | { type: "konami" }
  | { type: "cat" }
  | { type: "coffee" }
  | { type: "hire" }
  | { type: "melt" }
  | { type: "sandwich" };

export const initialRoomFx: RoomFx = {
  lights: "on",
  weather: "none",
  konami: false,
  sandwich: false,
  coffeeUntil: 0,
  celebrateUntil: 0,
  meltUntil: 0,
  catToken: 0,
};

let fx: RoomFx = initialRoomFx;

export function getRoomFx() {
  return fx;
}

export function dispatchRoom(action: RoomAction) {
  const now = performance.now();
  switch (action.type) {
    case "weather":
      fx = { ...fx, weather: action.place };
      break;
    case "konami":
      fx = { ...fx, konami: true };
      break;
    case "cat":
      fx = { ...fx, catToken: fx.catToken + 1 };
      break;
    case "coffee":
      fx = { ...fx, coffeeUntil: now + 4500 };
      break;
    case "hire":
      fx = { ...fx, celebrateUntil: now + 2800, lights: "party" };
      break;
    case "melt":
      fx = { ...fx, meltUntil: now + 2400 };
      break;
    case "sandwich":
      fx = { ...fx, sandwich: true };
      break;
  }
}
