import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charts-description',
  templateUrl: './charts-description.component.html',
  styleUrls: ['./charts-description.component.scss']
})
export class ChartsDescriptionComponent implements OnInit {

  constructor(private router: Router) { }

  descriptionText = '';

  ngOnInit() {
    this.router.url === `/vacancies`
      ? this.descriptionText = `
      Здесь собрана статистика популярности языков и технологий.
      Мы формируем графики на основе данных, взятых с самых крупных и популярных IT ресурсов.`
      : this.router.url === `/salaries`
        ? this.descriptionText = `Статистика зарплат по опыту разаботчиков. Цифры выводятся по среднему значению между ресурсами.
        Данные играют статистическую роль, показывают общую картину. Реальные цифры могут отличаться от приведенных здесь.`
        : this.router.url === `/freelance`
          ? this.descriptionText = `Здесь собраны данные о спросе и предложении в IT сфере на крупнейшем ресурсе по фрилансу - upwork.com. `
          : this.router.url === `/relocate`
            ? this.descriptionText = `Статистика популярности языков и технологий, востребованных для релокейта.
            Формируется на основе данных, взятых с самых крупных и популярных IT ресурсов,
            имеющих полную или частичную ориентацию на релокейт вакансии.`
            : this.router.url === `/startups`
              ? this.descriptionText = `Здесь собрана статистика по популярности языков и технологий, востребованных в сфере стартапов.
              За основу взяты ресурсы, имеющие полную или частичную ориентацию на стартапы.`
              : this.descriptionText = ``;
  }

}
