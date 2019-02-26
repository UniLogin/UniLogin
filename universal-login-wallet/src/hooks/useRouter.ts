import {useContext} from "react";
import {RouterContext} from "../services/CustomRouter";

export function useRouter() {
  return useContext(RouterContext);
}
