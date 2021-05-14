import React from "react";
import {Tab} from "./lib/Models";

const ToRead: Tab = {
    status: "toread",
    tabLabel: "To read",
    buttonLabel: <span className="ButtonLabel">start reading →</span>,
    nextStatus: "inprogress",
}

const InProgress: Tab = {
    status: "inprogress",
    tabLabel: "In progress",
    buttonLabel: <span className="ButtonLabel">finish reading →</span>,
    nextStatus: "done",
}

const Done: Tab = {
    status: "done",
    tabLabel: "Done",
    buttonLabel: <span className="ButtonLabel">return in «to read» ↲</span>,
    nextStatus: "toread",
}

export const tabValues: Array<Tab> = [ToRead, InProgress, Done];
