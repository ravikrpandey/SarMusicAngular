import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-easeontech',
  templateUrl: './easeontech.component.html',
  styleUrls: ['./easeontech.component.scss']
})
export class EaseontechComponent implements OnInit {

  isMenuOpen = false;

  services = [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like Angular, React, and Node.js for optimal performance and user experience.',
      icon: 'web'
    },
    {
      title: 'Mobile Applications',
      description: 'Native and cross-platform mobile apps for iOS and Android using React Native, Flutter, and Ionic.',
      icon: 'smartphone'
    },
    {
      title: 'E-commerce Solutions',
      description: 'Complete e-commerce platforms with payment integration, inventory management, and customer analytics.',
      icon: 'shopping_cart'
    },
    {
      title: 'Custom Software',
      description: 'Tailored software solutions for businesses, including CRM systems, automation tools, and enterprise applications.',
      icon: 'code'
    },
    {
      title: 'API Development',
      description: 'RESTful APIs and microservices architecture for seamless integration and scalable backend solutions.',
      icon: 'api'
    },
    {
      title: 'Cloud Solutions',
      description: 'AWS, Azure, and Google Cloud deployment with DevOps practices for reliable and scalable applications.',
      icon: 'cloud'
    }
  ];

  portfolio = [
    {
      title: 'SaR Music Platform',
      description: 'A comprehensive music streaming platform with user authentication, playlist management, and real-time audio streaming.',
      image: 'assets/sarmusic-streaming.png',
      background: 'assets/sarmusic-streaming.png',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'AWS'],
      category: 'Web Application',
      link: '/auth'
    },
    {
      title: 'MyTaxFinder.com',
      description: 'Tax calculation and filing platform helping users find optimal tax solutions and maximize returns.',
      image: 'assets/mytaxfinder-page.png',
      background: 'mytaxfinder-page.png',
      technologies: ['React', 'Python', 'PostgreSQL', 'Stripe'],
      category: 'E-commerce',
      link: 'https://mytaxfinder.com'
    },
    {
      title: 'EaseOnTech Corporate',
      description: 'Company website showcasing software development services and portfolio projects.',
      image: 'assets/corporate-site.jpg',
      technologies: ['Angular', 'SCSS', 'TypeScript', 'Responsive Design'],
      category: 'Corporate Website',
      link: '/easeontech'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'CEO, MyTaxFinder',
      content: 'EaseOnTech delivered an exceptional tax platform that exceeded our expectations. The team\'s expertise in both frontend and backend development made the entire process seamless.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      position: 'Product Manager, TechCorp',
      content: 'Working with EaseOnTech was a game-changer for our business. They built a custom CRM that streamlined our operations and improved customer satisfaction by 40%.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      position: 'Founder, MusicStartup',
      content: 'The music platform developed by EaseOnTech is exactly what we needed. Their attention to detail and user experience design is outstanding.',
      rating: 5
    }
  ];

  stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '25+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' }
  ];

  technologies = [
    'Angular', 'React', 'Vue.js', 'Node.js', 'Python', 'Java', 'AWS', 'Azure', 
    'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL'
  ];

  constructor(private router: Router) { }

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

  navigateToMusic(): void {
    this.router.navigate(['/auth']);
  }

  openPortfolioLink(link: string): void {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      this.router.navigate([link]);
    }
  }

  getStarRating(rating: number): number[] {
    return Array(rating).fill(0);
  }
} 