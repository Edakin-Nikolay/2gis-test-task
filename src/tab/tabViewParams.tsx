import React from "react";
import {Tab} from "./models";
import {Status} from "../book/models";

const ToRead: Tab = {
    status: Status.ToRead,
    tabLabel: "To read",
    buttonLabel: <span><span className="button-label">start reading</span>&nbsp;→</span>,
    nextStatus: Status.InProgress,
}

const InProgress: Tab = {
    status: Status.InProgress,
    tabLabel: "In progress",
    buttonLabel: <span><span className="button-label">finish reading</span>&nbsp;→</span>,
    nextStatus: Status.Done,
}

const Done: Tab = {
    status: Status.Done,
    tabLabel: "Done",
    buttonLabel: <span><span className="button-label">return in «to read»</span>&nbsp;↲</span>,
    nextStatus: Status.ToRead,
}

export const tabValues: Array<Tab> = [ToRead, InProgress, Done];
