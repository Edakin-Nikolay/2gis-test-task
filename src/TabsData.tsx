import React from "react";
import {Status, Tab} from "./lib/Models";

const ToRead: Tab = {
    status: Status.Toread,
    tabLabel: "To read",
    buttonLabel: <span><span className="button-label">start reading</span>&nbsp;→</span>,
    nextStatus: Status.Inprogress,
}

const InProgress: Tab = {
    status: Status.Inprogress,
    tabLabel: "In progress",
    buttonLabel: <span><span className="button-label">finish reading</span>&nbsp;→</span>,
    nextStatus: Status.Done,
}

const Done: Tab = {
    status: Status.Done,
    tabLabel: "Done",
    buttonLabel: <span><span className="button-label">return in «to read»</span>&nbsp;↲</span>,
    nextStatus: Status.Toread,
}

export const tabValues: Array<Tab> = [ToRead, InProgress, Done];
