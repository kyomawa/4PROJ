﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using incident_service.Contexts;

#nullable disable

namespace incident_service.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20250414132255_UserIncidentVote")]
    partial class UserIncidentVote
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("incident_service.Models.Incident", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime(6)")
                        .HasColumnName("CreationDate");

                    b.Property<int>("Dislike")
                        .HasColumnType("int")
                        .HasColumnName("Dislike");

                    b.Property<double>("Latitude")
                        .HasColumnType("double")
                        .HasColumnName("Latitude");

                    b.Property<int>("Like")
                        .HasColumnType("int")
                        .HasColumnName("Like");

                    b.Property<double>("Longitude")
                        .HasColumnType("double")
                        .HasColumnName("Longitude");

                    b.Property<int>("Status")
                        .HasColumnType("int")
                        .HasColumnName("Status");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("Type");

                    b.HasKey("Id");

                    b.ToTable("Incident");
                });

            modelBuilder.Entity("incident_service.Models.UserIncidentVote", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("IncidentId")
                        .HasColumnType("char(36)");

                    b.Property<int>("Reaction")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("IncidentId");

                    b.ToTable("UserIncidentVotes");
                });

            modelBuilder.Entity("incident_service.Models.UserIncidentVote", b =>
                {
                    b.HasOne("incident_service.Models.Incident", "Incident")
                        .WithMany("Votes")
                        .HasForeignKey("IncidentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Incident");
                });

            modelBuilder.Entity("incident_service.Models.Incident", b =>
                {
                    b.Navigation("Votes");
                });
#pragma warning restore 612, 618
        }
    }
}
