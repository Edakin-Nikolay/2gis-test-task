import {ReactElement} from "react";
import {Status} from "../book/models";

export type ButtonLabel = ReactElement;
type Label = String;

export interface Tab {
    status: Status,
    tabLabel: Label,
    buttonLabel: ButtonLabel,
    nextStatus: Status,
}
