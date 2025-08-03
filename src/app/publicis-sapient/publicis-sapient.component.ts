import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-publicis-sapient',
  templateUrl: './publicis-sapient.component.html',
  styleUrls: ['./publicis-sapient.component.scss']
})
export class PublicisSapientComponent implements OnInit {

  isMenuOpen = false;

  services = [
    {
      title: 'Artificial Intelligence',
      description: 'AI-powered solutions to drive innovation and competitive advantage.',
      icon: 'psychology'
    },
    {
      title: 'Experience Transformation',
      description: 'Creating exceptional digital experiences that engage and delight users.',
      icon: 'palette'
    },
    {
      title: 'Digital Commerce',
      description: 'End-to-end digital commerce solutions for modern businesses.',
      icon: 'shopping_cart'
    },
    {
      title: 'Digital Engineering',
      description: 'Modern engineering practices to build scalable digital solutions.',
      icon: 'engineering'
    }
  ];

  clients = [
    'Financial Services',
    'Retail',
    'Health',
    'Telecom, Media & Tech',
    'Transportation & Mobility',
    'Travel & Hospitality',
    'Consumer Products',
    'Energy & Commodities'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }
} 