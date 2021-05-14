import React from "react";
import {Tab} from "./lib/Models";

export const ToRead: Tab = {
    status: "toRead",
    tabLabel: "To read",
    buttonLabel: <span className="ButtonLabel">start reading →</span>,
    nextStatus: "inProgress",
}

export const InProgress: Tab = {
    status: "inProgress",
    tabLabel: "In progress",
    buttonLabel: <span className="ButtonLabel">finish reading →</span>,
    nextStatus: "done",
}

export const Done: Tab = {
    status: "done",
    tabLabel: "Done",
    buttonLabel: <span className="ButtonLabel">return in «to read» ↲</span>,
    nextStatus: "toRead",
}
