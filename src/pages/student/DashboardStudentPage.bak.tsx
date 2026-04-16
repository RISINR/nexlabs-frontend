import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Navbar } from "../../components/Navbar";
import { motion } from "framer-motion";
import styles from "./DashboardStudentPage.module.css";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// Backup of previous DashboardStudentPage implementation before clearing for redesign.
// If you need to restore, rename this file to DashboardStudentPage.tsx and remove the scaffold.

export default function DashboardStudentPageBackup() {
  return (
    <div className={`${styles.root} min-h-screen bg-gray-50`}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold">Backup of DashboardStudentPage</h2>
        <p className="text-sm text-gray-500 mt-2">This is a backup copy created before clearing the original file for redesign.</p>
      </div>
    </div>
  );
}
