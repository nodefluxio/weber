# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- [FRONTEND] Add Responsive Image Component
- [FRONTEND] Add nodeflux social media, products, and company links
- [FRONTEND] Add solutions banner image
- [FRONTEND] Add Horizontal Card Component
- [BACKEND] Add new seed for innovation Car Damage Assessment

### Changed

- [FRONTEND] Update contact us direct link
- [FRONTEND] Update banner image of analytics
- [FRONTEND] Update Navbar to be sticky on all devices
- [FRONTEND] Fix Carousel still slide when dot is clicked
- [FRONTEND] Make analytic cards smaller on mobile
- [FRONTEND] Changed error message & placeholder on payment form
- [FRONTEND] Update input PinInput mode as numerical (mobile browser)
- [FRONTEND] New OCR Receipt result display (colorized JSON dan simpler text display)
- [FRONTEND] Make solution cards slideable/swipeable
- [FRONTEND] Fix title for analytics page
- [BACKEND] Rename variable URL_OCR_RECEIPT to URL_INNOVATIONS in .env file
- [BACKEND] Update HTTP requester for innovation to use URL_INNOVATIONS dinamically by combine it with slug

### Removed

## [0.4.0 - 25/11/2021]

### Added

- [FRONTEND] Add OCR Receipt Innovations Page
- [FRONTEND] Add current balance to catalog browse step
- [FRONTEND] Add feature to remove local storage if face payment face analytics failed
- [FRONTEND] Add back to catalog feature if balance insufficient
- [FRONTEND] Add reset balance feature
- [FRONTEND] Add shopping balance in catalog
- [FRONTEND] Make Big Input Component responsive
- [FRONTEND] Add contact us link
- [BACKEND] Add HTTP Requester for OCR Receipt Recognition Innovation
- [BACKEND] Add API Reset Balance Account on Face Payment
- [BACKEND] Add entrypoint command for seed only

### Changed

- [FRONTEND] Change pin required checking to client side
- [FRONTEND] Change phone checking to client side
- [FRONTEND] Error handling mechanism
- [FRONTEND] Revamp landing page
- [FRONTEND] Fix Camera not full on mobile
- [FRONTEND] Fix compressed photo quality on Camera
- [FRONTEND] Fix cannot use external webcam
- [FRONTEND] Change catalog shopping items
- [FRONTEND] Update Face Match with Enrollment examples with our CEO & CTO faces
- [FRONTEND] Remove short description on Banner
- [FRONTEND] Update secondary fonts
- [FRONTEND] Update Face-payment instructions
- [FRONTEND] Update ActivationForm wording about PIN
- [FRONTEND] Fix minimum payment for pin input accept 1000000
- [BACKEND] Refactor API Get Activate Account on Face Payment
- [BACKEND] Update description on seeds data
- [BACKEND] Update env FACE_ID to use by Face Match with Enrollment matching with our CEO's face

### Removed

- [FRONTEND] Remove check-phone api handler
- [FRONTEND] Remove short description on Banner
- [BACKEND] Remove API Check Limit on Face Payment

## [0.3.0 - 17/11/2021]

### Added

- [FRONTEND] Add loading animation
- [FRONTEND] Face Payment Main Menu
- [FRONTEND] Face Payment Registration Form
- [FRONTEND] Face Payment Activation Pin Form
- [FRONTEND] Face Payment Store Catalog
- [FRONTEND] Face Payment Webcam Photo Uploader
- [FRONTEND] Face Payment Confirmation & Pay Transaction
- [FRONTEND] Add thumbnails data from cropping original image data
- [FRONTEND] Add new analytic People Density, Face Demography, & Face Mask
- [BACKEND] Thumbnails data from cropping original image data
- [BACKEND] Add new seeds for analytic People Density, Face Demography, & Face Mask

### Changed

- [FRONTEND] Refactor E-KYC User Flow
- [FRONTEND] UI Responsiveness
- [BACKEND] Move the env loader file on `init()` method
- [BACKEND] Fix database connection that always re-initialized

## [0.2.0 - 29/10/2021]

### Added

- [FRONTEND] Feedback form
- [FRONTEND] Agnostic analytic page
- [FRONTEND] Analytic result for Face Match w/ Enrollment and LPR
- [FRONTEND] Open Camera and Capture Image
- [FRONTEND] e-KYC analytic face liveness
- [BACKEND] Completeness tracker
- [BACKEND] Feedback recorder

### Changed

- [FRONTEND] Fixing Industry as dropdown input
- [FRONTEND] More proper styling on landing page
- Feedback validation (1-3 stars requires comment before submit, 0 will unable to submit)

### Removed

[FRONTEND] Try again button on analytics page

## [0.1.0 - 19/10/2021]

### Added

- [FRONTEND] Landing Page
- [FRONTEND] Form Request Demo
- [FRONTEND] Modal User Information
- [FRONTEND] OCR KTP Page
- [FRONTEND] OCR KTP User Input by Drag & Drop
- [FRONTEND] OCR KTP User Input by Sample
- [FRONTEND] OCR KTP Page Result
- [BACKEND] API Create Visitor
- [BACKEND] API Request to Cloud (OCR KTP Analytic)
- [BACKEND] API Get List Services
- [BACKEND] API Get Service by ID
- [BACKEND] API Create Service Request
- [BACKEND] Validation in Form Request Demo & OCR KTP
