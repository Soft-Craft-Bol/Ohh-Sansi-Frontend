import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, BookOpen, TrendingUp, Clock, MapPin, Award, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './OlimpiadasDashboard.css';
import {getEstadoOrdenPago} from '../../../api/api'
import SummaryCard from '../pagos/SummaryCard';

const OlimpiadasDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [loading, setLoading] = useState(false);
  
  // Datos simulados del dashboard
  const [dashboardData, setDashboardData] = useState({
    totalParticipants: 1245,
    activeOlympiads: 8,
    completedOlympiads: 15,
    upcomingEvents: 3,
    totalPrizes: 4500,
    registrationFee: 85000,
    pendingPayments: 12,
    topCategories: [
      { name: 'Matemáticas', participants: 298, growth: '+12%' },
      { name: 'Física', participants: 267, growth: '+8%' },
      { name: 'Química', participants: 189, growth: '+15%' },
      { name: 'Biología', participants: 156, growth: '+5%' }
    ],
    recentActivity: [
      { type: 'registration', student: 'Juan Pérez', olympiad: 'Matemáticas', time: '2 horas' },
      { type: 'payment', student: 'María González', olympiad: 'Física', time: '3 horas' },
      { type: 'completion', student: 'Carlos Mamani', olympiad: 'Química', time: '5 horas' }
    ],
    upcomingOlympiads: [
      { name: 'Olimpiada de Informática', date: '2024-06-15', participants: 89, location: 'Aula Magna' },
      { name: 'Olimpiada de Historia', date: '2024-06-22', participants: 67, location: 'Facultad de Humanidades' },
      { name: 'Olimpiada de Geografía', date: '2024-06-29', participants: 43, location: 'Centro de Convenciones' }
    ]
  });

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'registration': return <User size={16} />;
        case 'payment': return <CheckCircle size={16} />;
        case 'completion': return <Trophy size={16} />;
        default: return <AlertCircle size={16} />;
      }
    };

    const getTypeText = (type) => {
      switch (type) {
        case 'registration': return 'Se registró en';
        case 'payment': return 'Realizó pago para';
        case 'completion': return 'Completó';
        default: return 'Actividad en';
      }
    };

    return (
      <div className="dad-activity-item">
        <div className={`dad-activity-item__icon dad-activity-item__icon--${activity.type}`}>
          {getIcon(activity.type)}
        </div>
        <div className="dad-activity-item__content">
          <p>
            <strong>{activity.student}</strong> {getTypeText(activity.type)} <em>{activity.olympiad}</em>
          </p>
          <span className="dad-activity-item__time">hace {activity.time}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`dad-dashboard`}>
      {/* Header */}
      <div className="dad-dashboard__header">
        <div className="dad-dashboard__title">
          <h1>Dashboard de Olimpiadas</h1>
          <p>Universidad Mayor de San Simón</p>
        </div>
        <div className="dad-dashboard__controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="dad-dashboard__period-select"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="dad-dashboard__stats">
        <SummaryCard 
          title="Total Participantes" 
          value={dashboardData.totalParticipants}
          icon={Users}
          trend="+23%"
          color="blue"
        />
        <SummaryCard 
          title="Olimpiadas Activas" 
          value={dashboardData.activeOlympiads}
          icon={Trophy}
          trend="+2"
          color="green"
        />
        <SummaryCard 
          title="Eventos Completados" 
          value={dashboardData.completedOlympiads}
          icon={CheckCircle}
          trend="+5"
          color="purple"
        />
        <SummaryCard 
          title="Próximos Eventos" 
          value={dashboardData.upcomingEvents}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Financial Overview */}
      <div className="dad-dashboard__financial">
        <SummaryCard 
          title="Total en Premios" 
          value={dashboardData.totalPrizes}
          icon={Award}
          color="gold"
          isAmount={true}
        />
        <SummaryCard 
          title="Ingresos por Inscripción" 
          value={dashboardData.registrationFee}
          icon={TrendingUp}
          trend="+18%"
          color="green"
          isAmount={true}
        />
        <SummaryCard 
          title="Pagos Pendientes" 
          value={dashboardData.pendingPayments}
          icon={Clock}
          color="red"
        />
      </div>

      {/* Content Grid */}
      <div className="dad-dashboard__content">
        {/* Top Categories */}
        <div className="dad-dashboard__card">
          <h3 className="dad-dashboard__card-title">
            <BookOpen size={20} />
            Categorías Más Populares
          </h3>
          <div className="dad-categories-list">
            {dashboardData.topCategories.map((category, index) => (
              <div key={index} className="dad-category-item">
                <div className="dad-category-item__info">
                  <h4>{category.name}</h4>
                  <p>{category.participants} participantes</p>
                </div>
                <div className="dad-category-item__growth">
                  <span className="dad-category-item__growth-badge">
                    {category.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dad-dashboard__card">
          <h3 className="dad-dashboard__card-title">
            <Clock size={20} />
            Actividad Reciente
          </h3>
          <div className="dad-activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>
        </div>

        {/* Upcoming Olympiads */}
        <div className="dad-dashboard__card dad-dashboard__card--full">
          <h3 className="dad-dashboard__card-title">
            <Calendar size={20} />
            Próximas Olimpiadas
          </h3>
          <div className="dad-olympiads-grid">
            {dashboardData.upcomingOlympiads.map((olympiad, index) => (
              <div key={index} className="dad-olympiad-card">
                <div className="dad-olympiad-card__header">
                  <h4>{olympiad.name}</h4>
                  <span className="dad-olympiad-card__date">{olympiad.date}</span>
                </div>
                <div className="dad-olympiad-card__details">
                  <div className="dad-olympiad-card__stat">
                    <Users size={16} />
                    <span>{olympiad.participants} inscritos</span>
                  </div>
                  <div className="dad-olympiad-card__stat">
                    <MapPin size={16} />
                    <span>{olympiad.location}</span>
                  </div>
                </div>
                <button className="dad-olympiad-card__action">
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="dad-dashboard__loading">
          <div className="dad-dashboard__spinner"></div>
          <p>Actualizando datos...</p>
        </div>
      )}
    </div>
  );
};

export default OlimpiadasDashboard;