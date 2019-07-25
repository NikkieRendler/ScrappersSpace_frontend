import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  type = 'horizontalBar';
  data = {
    labels: ["JavaScript", "Python", "Java", "C", "C++", "C#"],
    datasets: [{
      label: "Вакансии",
      data: [1912, 1678, 1598, 2589, 1689, 1389],
      backgroundColor: [
        'rgba(255, 25, 112, .5)',
        'rgba(155, 78, 152, .5)',
        'rgba(205, 111, 182, .5)',
        'rgba(125, 178, 212, .5)',
        'rgba(175, 250, 252, .5)',
      ]
    }]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: true,
      labels: {
        fontColor: 'rgb(255, 99, 132)'
      }
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
