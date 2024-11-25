"use client";

import { useEffect, useState } from "react";
import { Typo } from "@/app/_components/_layout/typography";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getUsersByMonth } from "./actions";

export function Dashboard({
  counts,
  revenueByMovies,
  revenueByCinemas,
  revenueByYearData,
}: {
  counts: any;
  revenueByMovies: any;
  revenueByCinemas: any;
  revenueByYearData: any;
  usersByMonth: any;
}) {
  const [usersByMonth, setUsersByMonth] = useState<any[]>([]);

  // Charger les données utilisateurs par mois
  useEffect(() => {
    async function loadUsersByMonth() {
      const data = await getUsersByMonth();
      setUsersByMonth(data);
    }
    loadUsersByMonth();
  }, []);

  return (
    <div className="space-y-6 w-[90%] mx-auto">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <Typo variant="h5" theme="secondary" className="mx-auto text-center">
              Admins
            </Typo>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center font-bold">{counts.adminCount}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Typo variant="h5" theme="secondary" className="mx-auto text-center">
              Managers
            </Typo>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{counts.managerCount}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Typo variant="h5" theme="secondary" className="mx-auto text-center">
              Utilisateurs
            </Typo>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{counts.userCount}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Typo variant="h5" theme="secondary" className="mx-auto text-center">
              Films
            </Typo>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{counts.movieCount}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Typo variant="h5" theme="secondary" className="mx-auto text-center">
              Cinémas
            </Typo>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{counts.cinemaCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique : Nombre d'utilisateurs par mois */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Utilisateurs par mois</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={usersByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chiffre d'affaires par film */}
      <div className="space-y-4">
        <Typo variant="h5" theme="secondary" className="mx-auto text-center">
          Chiffre d'affaires par films
        </Typo>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueByMovies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chiffre d'affaires par cinémas */}
      <div className="space-y-4">
        <Typo variant="h5" theme="secondary" className="mx-auto text-center">
          Chiffre d'affaires par cinémas
        </Typo>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueByCinemas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chiffre d'affaires par années */}
      <div className="space-y-4">
        <Typo variant="h5" theme="secondary" className="mx-auto text-center">
          Chiffre d'affaires par années
        </Typo>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueByYearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
