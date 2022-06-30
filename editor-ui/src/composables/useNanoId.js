import { customAlphabet } from "nanoid/async";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzu";

export default function useNanoid() {
  const shortId = async () => {
    const nanoid = customAlphabet(alphabet, 8);

    const uid = await nanoid();
    return uid;
  };

  const longId = async () => {
    const nanoid = customAlphabet(alphabet, 20);

    const uid = await nanoid();

    // Split that into 5 chunks of 4 char each, then join with hyphen
    const tUid = uid.match(new RegExp(".{1," + 4 + "}", "g")).join("-");

    data.id = tUid;
    return tUid;
  };

  return {
    longId,
    shortId,
  };
}
