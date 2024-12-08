/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as appIndexImport } from './routes/(app)/index'
import { Route as authSignupImport } from './routes/(auth)/signup'
import { Route as authLoginImport } from './routes/(auth)/login'
import { Route as authAuthImport } from './routes/(auth)/_auth'
import { Route as appAboutImport } from './routes/(app)/about'
import { Route as authAuthProfileImport } from './routes/(auth)/_auth.profile'
import { Route as appCategoriesCategoryImport } from './routes/(app)/categories/$category'

// Create Virtual Routes

const authImport = createFileRoute('/(auth)')()

// Create/Update Routes

const authRoute = authImport.update({
  id: '/(auth)',
  getParentRoute: () => rootRoute,
} as any)

const appIndexRoute = appIndexImport.update({
  id: '/(app)/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const authSignupRoute = authSignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => authRoute,
} as any)

const authLoginRoute = authLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => authRoute,
} as any)

const authAuthRoute = authAuthImport.update({
  id: '/_auth',
  getParentRoute: () => authRoute,
} as any)

const appAboutRoute = appAboutImport.update({
  id: '/(app)/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const authAuthProfileRoute = authAuthProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => authAuthRoute,
} as any)

const appCategoriesCategoryRoute = appCategoriesCategoryImport.update({
  id: '/(app)/categories/$category',
  path: '/categories/$category',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(app)/about': {
      id: '/(app)/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof appAboutImport
      parentRoute: typeof rootRoute
    }
    '/(auth)': {
      id: '/(auth)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/_auth': {
      id: '/(auth)/_auth'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authAuthImport
      parentRoute: typeof authRoute
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginImport
      parentRoute: typeof authImport
    }
    '/(auth)/signup': {
      id: '/(auth)/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authSignupImport
      parentRoute: typeof authImport
    }
    '/(app)/': {
      id: '/(app)/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof appIndexImport
      parentRoute: typeof rootRoute
    }
    '/(app)/categories/$category': {
      id: '/(app)/categories/$category'
      path: '/categories/$category'
      fullPath: '/categories/$category'
      preLoaderRoute: typeof appCategoriesCategoryImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/_auth/profile': {
      id: '/(auth)/_auth/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof authAuthProfileImport
      parentRoute: typeof authAuthImport
    }
  }
}

// Create and export the route tree

interface authAuthRouteChildren {
  authAuthProfileRoute: typeof authAuthProfileRoute
}

const authAuthRouteChildren: authAuthRouteChildren = {
  authAuthProfileRoute: authAuthProfileRoute,
}

const authAuthRouteWithChildren = authAuthRoute._addFileChildren(
  authAuthRouteChildren,
)

interface authRouteChildren {
  authAuthRoute: typeof authAuthRouteWithChildren
  authLoginRoute: typeof authLoginRoute
  authSignupRoute: typeof authSignupRoute
}

const authRouteChildren: authRouteChildren = {
  authAuthRoute: authAuthRouteWithChildren,
  authLoginRoute: authLoginRoute,
  authSignupRoute: authSignupRoute,
}

const authRouteWithChildren = authRoute._addFileChildren(authRouteChildren)

export interface FileRoutesByFullPath {
  '/about': typeof appAboutRoute
  '/': typeof appIndexRoute
  '/login': typeof authLoginRoute
  '/signup': typeof authSignupRoute
  '/categories/$category': typeof appCategoriesCategoryRoute
  '/profile': typeof authAuthProfileRoute
}

export interface FileRoutesByTo {
  '/about': typeof appAboutRoute
  '/': typeof appIndexRoute
  '/login': typeof authLoginRoute
  '/signup': typeof authSignupRoute
  '/categories/$category': typeof appCategoriesCategoryRoute
  '/profile': typeof authAuthProfileRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(app)/about': typeof appAboutRoute
  '/(auth)': typeof authRouteWithChildren
  '/(auth)/_auth': typeof authAuthRouteWithChildren
  '/(auth)/login': typeof authLoginRoute
  '/(auth)/signup': typeof authSignupRoute
  '/(app)/': typeof appIndexRoute
  '/(app)/categories/$category': typeof appCategoriesCategoryRoute
  '/(auth)/_auth/profile': typeof authAuthProfileRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/about'
    | '/'
    | '/login'
    | '/signup'
    | '/categories/$category'
    | '/profile'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/about'
    | '/'
    | '/login'
    | '/signup'
    | '/categories/$category'
    | '/profile'
  id:
    | '__root__'
    | '/(app)/about'
    | '/(auth)'
    | '/(auth)/_auth'
    | '/(auth)/login'
    | '/(auth)/signup'
    | '/(app)/'
    | '/(app)/categories/$category'
    | '/(auth)/_auth/profile'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  appAboutRoute: typeof appAboutRoute
  authRoute: typeof authRouteWithChildren
  appIndexRoute: typeof appIndexRoute
  appCategoriesCategoryRoute: typeof appCategoriesCategoryRoute
}

const rootRouteChildren: RootRouteChildren = {
  appAboutRoute: appAboutRoute,
  authRoute: authRouteWithChildren,
  appIndexRoute: appIndexRoute,
  appCategoriesCategoryRoute: appCategoriesCategoryRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(app)/about",
        "/(auth)",
        "/(app)/",
        "/(app)/categories/$category"
      ]
    },
    "/(app)/about": {
      "filePath": "(app)/about.tsx"
    },
    "/(auth)": {
      "filePath": "(auth)",
      "children": [
        "/(auth)/_auth",
        "/(auth)/login",
        "/(auth)/signup"
      ]
    },
    "/(auth)/_auth": {
      "filePath": "(auth)/_auth.tsx",
      "parent": "/(auth)",
      "children": [
        "/(auth)/_auth/profile"
      ]
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx",
      "parent": "/(auth)"
    },
    "/(auth)/signup": {
      "filePath": "(auth)/signup.tsx",
      "parent": "/(auth)"
    },
    "/(app)/": {
      "filePath": "(app)/index.tsx"
    },
    "/(app)/categories/$category": {
      "filePath": "(app)/categories/$category.tsx"
    },
    "/(auth)/_auth/profile": {
      "filePath": "(auth)/_auth.profile.tsx",
      "parent": "/(auth)/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
