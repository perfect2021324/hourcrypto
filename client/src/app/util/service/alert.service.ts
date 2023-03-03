import { Injectable } from "@angular/core";
import Swal from "sweetalert2";



export class AlertService {

    static toast = (title: String, code: Number, message: String = "", options?: { timer?: Number, target?: String }) => {
        Swal.fire({ title: title.valueOf(), html: message?.valueOf(), icon: code === 200 ? "success" : "error", toast: true, showConfirmButton: false, showCloseButton: true, target: options?.target?.valueOf() ?? "body", position: "bottom", timer: options?.timer?.valueOf() })
    }
}