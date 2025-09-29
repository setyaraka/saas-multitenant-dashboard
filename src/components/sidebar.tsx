import { Button } from "@heroui/button";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Col from "./layout/col";
import Container from "./layout/container";
import Row from "./layout/row";
import {
  AnalyticIcon,
  AuditLogIcon,
  FolderIcon,
  HomeIcon,
  MenuIcon,
  OperationIcon,
  OrderIcon,
  SettingIcon,
  UserIcon,
} from "./icons";

export default function Sidebar() {
  const iconClassName = "w-5 h-5 text-gray-800 border-none";
  const navigate = useNavigate();
  const location = useLocation();

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const linkTo = (label: string, parent?: string) => {
    const slug = toSlug(label);

    if (!parent && slug === "overview") return "/";

    return `/${parent ? `${toSlug(parent)}/` : ""}${slug}`;
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";

    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const baseBtn = "justify-start w-full mt-2";
  const activeBtn =
    "bg-default-100 text-foreground font-medium data-[hover=true]:bg-default-200";

  type NavBtnProps = {
    to: string;
    label: string;
    Icon?: React.ElementType;
    className?: string;
  };

  const NavButton: React.FC<NavBtnProps> = ({ to, label, Icon, className }) => (
    <Button
      className={`${baseBtn} ${isActive(to) ? activeBtn : ""} ${className ?? ""}`}
      variant="light"
      onPress={() => navigate(to)}
    >
      {Icon ? <Icon className={iconClassName} /> : null}
      {label}
    </Button>
  );

  return (
    <div className="w-70 pt-5 h-max-screen bg-white border border-gray-200">
      <Row className="my-2">
        <Col className="pr-3" xs={3}>
          <span className="ml-auto w-9 h-9 bg-gray-400 rounded-xl flex items-center justify-center text-white font-semibold">
            A
          </span>
        </Col>
        <Col xs={9}>
          <p className="text-sm font-semibold">Alpha Coffee</p>
          <p className="text-xs text-gray-500">Multi-tenant demo</p>
        </Col>
      </Row>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
          OVERVIEW
        </p>
      </Container>
      <div>
        <NavButton Icon={HomeIcon} label="Overview" to={linkTo("Overview")} />
        <NavButton Icon={OrderIcon} label="Orders" to={linkTo("Orders")} />
        <NavButton Icon={MenuIcon} label="Menu" to={linkTo("Menu")} />
        <NavButton
          Icon={AnalyticIcon}
          label="Analytics"
          to={linkTo("Analytics")}
        />
      </div>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
          MANAGEMENT
        </p>
      </Container>
      <div>
        <Accordion isCompact variant="splitted">
          <AccordionItem
            key="1"
            aria-label="catalog"
            startContent={<FolderIcon className={iconClassName} />}
            title="Catalog"
          >
            <NavButton
              label="Categories"
              to={linkTo("Categories", "Catalog")}
            />
            <NavButton label="Modifier" to={linkTo("Modifier", "Catalog")} />
          </AccordionItem>

          <AccordionItem
            key="2"
            aria-label="operations"
            startContent={<OperationIcon className={iconClassName} />}
            title="Operations"
          >
            <NavButton
              label="Kitchen Display"
              to={linkTo("Kitchen Display", "Operations")}
            />
            <NavButton label="Shift" to={linkTo("Shift", "Operations")} />
          </AccordionItem>

          <AccordionItem
            key="3"
            aria-label="users & role"
            startContent={<UserIcon className={iconClassName} />}
            title="Users & Roles"
          >
            <NavButton label="Users" to={linkTo("Users", "Users & Role")} />
            <NavButton label="Role" to={linkTo("Role", "Users & Role")} />
          </AccordionItem>
        </Accordion>
      </div>

      <Container className="mt-5">
        <p className="mb-2 text-xs uppercase font-semibold text-gray-500">
          SYSTEM
        </p>
      </Container>
      <div>
        <NavButton
          Icon={SettingIcon}
          label="Settings"
          to={linkTo("Settings")}
        />
        <NavButton
          Icon={AuditLogIcon}
          label="Audit Log"
          to={linkTo("Audit Log")}
        />
      </div>
    </div>
  );
}
