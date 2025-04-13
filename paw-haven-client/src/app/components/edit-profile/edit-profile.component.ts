import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserProfileModel } from '../../services/user.service';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfileModel | null = null;
  loading: boolean = true;
  saving: boolean = false;
  error: string | null = null;
  success: boolean = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      profileImageUrl: [''],
      // Organization fields
      organisationName: [''],
      organisationDescription: [''],
      organisationLocation: [''],
      organisationPhoneNumber: [''],
      organisationDonationCredentials: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      
      if (this.userId) {
        this.loadUserProfile(this.userId);
      } else {
        this.error = 'User ID not provided';
        this.loading = false;
      }
    });
  }

  loadUserProfile(userId: string): void {
    this.userService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.populateForm(profile);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'Failed to load profile. Please try again later.';
        this.loading = false;
      }
    });
  }

  populateForm(profile: UserProfileModel): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      profileImageUrl: profile.profileImageUrl || ''
    });

    // If user is an organization owner and has organization data
    if (profile.isOrganisationOwner && profile.organisation) {
      this.profileForm.patchValue({
        organisationName: profile.organisation.name,
        organisationDescription: profile.organisation.description,
        organisationLocation: profile.organisation.location,
        organisationPhoneNumber: profile.organisation.phoneNumber,
        organisationDonationCredentials: profile.organisation.donationCredentials
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = false;

    // Create the updated profile object
    const updatedProfile: any = {
      id: this.userProfile?.id,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      profileImageUrl: this.profileForm.value.profileImageUrl
    };

    // If user is an organization owner, include organization data
    if (this.userProfile?.isOrganisationOwner) {
      updatedProfile.organisation = {
        id: this.userProfile.organisation?.id,
        name: this.profileForm.value.organisationName,
        description: this.profileForm.value.organisationDescription,
        location: this.profileForm.value.organisationLocation,
        phoneNumber: this.profileForm.value.organisationPhoneNumber,
        donationCredentials: this.profileForm.value.organisationDonationCredentials
      };
    }

    if (this.userId) {
      this.userService.updateUserProfile(this.userId, updatedProfile).subscribe({
        next: (updatedProfile) => {
          this.saving = false;
          this.success = true;
          
          // Redirect back to profile page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/profile', this.userId]);
          }, 2000);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.error = 'Failed to update profile. Please try again later.';
          this.saving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/profile', this.userId]);
  }
}
