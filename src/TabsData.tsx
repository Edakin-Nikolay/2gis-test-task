import React from "react";
import {Tab} from "./lib/Models";

export const ToRead: Tab = {
    status: "toread",
    tabLabel: "To read",
    buttonLabel: <span><span className="button-label">start reading</span>&nbsp;→</span>,
    nextStatus: "inprogress",
}

const InProgress: Tab = {
    status: "inprogress",
    tabLabel: "In progress",
    buttonLabel: <span><span className="button-label">finish reading</span>&nbsp;→</span>,
    nextStatus: "done",
}

const Done: Tab = {
    status: "done",
    tabLabel: "Done",
    buttonLabel: <span><span className="button-label">return in «to read»</span>&nbsp;↲</span>,
    nextStatus: "toread",
}

export const tabValues: Array<Tab> = [ToRead, InProgress, Done];
