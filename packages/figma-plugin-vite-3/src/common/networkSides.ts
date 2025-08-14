import { Networker } from "monorepo-networker";
import { AuditResult } from "./types";

export const UI = Networker.createSide("UI-side").listens<{
  ping(): "pong";
  hello(text: string): void;
  auditResult(result: AuditResult): void;
}>();

export const PLUGIN = Networker.createSide("Plugin-side").listens<{
  ping(): "pong";
  hello(text: string): void;
  createRect(width: number, height: number): void;
  exportSelection(): Promise<string>;
  runAudit(): Promise<AuditResult>;
  selectLayer(layerId: string): void;
  resizeUI(width: number, height: number): void;
}>();
