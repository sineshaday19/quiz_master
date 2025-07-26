import React, { useState } from 'react';
import { Play, Users, BarChart3, Smartphone, Check, Menu, X, Star, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const QuizLandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        {
            icon: <Play className="w-12 h-12 text-indigo-600" />,
            title: 'Easy Quiz Creation',
            desc: 'Build quizzes with multiple question types in just a few clicks. Our intuitive interface makes quiz creation effortless.'
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-indigo-600" />,
            title: 'Instant Grading',
            desc: 'Get automatic results and feedback as soon as quizzes are submitted. Save time with intelligent scoring.'
        },
        {
            icon: <Users className="w-12 h-12 text-indigo-600" />,
            title: 'Detailed Analytics',
            desc: 'Track performance and progress with clear, visual reports. Understand learning patterns better.'
        },
        {
            icon: <Smartphone className="w-12 h-12 text-indigo-600" />,
            title: 'Mobile Friendly',
            desc: 'Take and create quizzes on any device, anywhere. Perfect responsive design for all screen sizes.'
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "High School Teacher",
            content: "QuizMaster has revolutionized how I create and manage quizzes. My students love the interactive format!",
            rating: 5
        },
        {
            name: "Mike Chen",
            role: "Corporate Trainer",
            content: "The analytics feature helps me understand which topics need more attention. Fantastic tool!",
            rating: 5
        },
        {
            name: "Emma Davis",
            role: "University Professor",
            content: "Easy to use, professional results. My quiz creation time has been cut in half.",
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            features: ["Up to 5 quizzes", "Basic analytics", "Mobile responsive", "Email support"],
            popular: false
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            features: ["Unlimited quizzes", "Advanced analytics", "Custom branding", "Priority support", "Export results"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "$49",
            period: "/month",
            features: ["Everything in Pro", "Team collaboration", "API access", "White-label solution", "Dedicated manager"],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Play className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                QuizMaster
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Reviews</a>
                            <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a>
                            <button onClick={() => window.location.href = "/login"} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                Get Started
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
                                <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium">Pricing</a>
                                <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium">Reviews</a>
                                <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
                                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                QuizMaster!
                            </span>
                        </h1>
                        <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Create Professional Quizzes in Minutes with our powerful, intuitive platform designed for educators and trainers.
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 font-semibold text-lg flex items-center space-x-2 shadow-lg">
                                <span>Start Creating Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors font-semibold text-lg">
                                Watch Demo
                            </button>
                        </div>
                        <div className="flex items-center justify-center space-x-6 mt-12 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Setup in 2 minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to create amazing quizzes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive platform provides all the tools you need to create, manage, and analyze quizzes like a pro.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                            >
                                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why choose QuizMaster?</h2>
                        <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                            Join thousands of educators and trainers who trust QuizMaster for their assessment needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
                            <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                            <p className="text-indigo-100">Create quizzes in minutes, not hours. Our streamlined interface gets you up and running instantly.</p>
                        </div>
                        <div className="text-center">
                            <Shield className="w-16 h-16 mx-auto mb-6 text-green-300" />
                            <h3 className="text-2xl font-bold mb-4">Secure & Reliable</h3>
                            <p className="text-indigo-100">Enterprise-grade security ensures your data and quizzes are always protected and accessible.</p>
                        </div>
                        <div className="text-center">
                            <Clock className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                            <h3 className="text-2xl font-bold mb-4">Save Time</h3>
                            <p className="text-indigo-100">Automatic grading and detailed analytics save you hours of manual work every week.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Loved by educators worldwide
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what our users have to say about QuizMaster
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that's right for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-8 rounded-2xl border-2 ${plan.popular
                                        ? 'border-indigo-600 bg-indigo-50 transform scale-105'
                                        : 'border-gray-200 bg-white'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-xl text-gray-500 ml-1">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-3" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to create your first quiz?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of educators and start creating professional quizzes today.
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg transform hover:scale-105">
                        Start Free Trial
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Play className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">QuizMaster</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                The ultimate platform for creating, managing, and analyzing quizzes. Built for educators, trainers, and anyone who wants to create engaging assessments.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2025 QuizMaster. All rights reserved. Built with ❤️ for educators worldwide.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default QuizLandingPage;