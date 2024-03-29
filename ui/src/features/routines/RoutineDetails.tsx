import { useState, useEffect, useRef, useMemo } from 'react';
import ResponsiveCard from '../../components/common/ResponsiveCard';
import { useParams } from 'react-router-dom';
import Routine, { DraggableSegment } from '../../model/routines/Routine';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormLabelProps,
  Heading,
  Icon, SimpleGrid,
  Tag,
  Text,
  Tooltip,
  VisuallyHidden
} from '@chakra-ui/react';
import LinkButton from '../../components/common/LinkButton';
import { BRoutes } from '../../router/routes';
import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons';
import SkeletonWrapper from '../../components/common/SkeletonWrapper';
import RoutineSegmentList from './RoutineSegmentList';
import RoutineUtils from '../../utils/RoutineUtils';
import { EditIcon, EditOffIcon, StopwatchIcon, UserLinkIcon } from '../../components/common/Icons';
import useAlertDialog from '../../hooks/useAlertDialog';
import RoutineEditForm from './RoutineEditForm';
import BAlert from '../../components/common/BAlert';
import InstructorService from '../../services/api/InstructorService';
import SimpleBreadcrumbs from '../../components/common/SimpleBreadcrumbs';
import BAvatar from '../../components/common/BAvatar';
import ResourceNotFound from '../../components/common/ResourceNotFound';

const RoutineDetails = () => {
  let { id } = useParams();
  const [routine, setRoutine] = useState<Routine>(); // Original
  const [segments, setSegments] = useState<DraggableSegment[]>([]); // Or
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const editModeRef = useRef<HTMLButtonElement>(null);
  const dialog = useAlertDialog();

  const retrieveRoutine = async (id: number) => {
    const res = await InstructorService.getRoutineDetail(id);
    if (res.hasError) {
      setLoading(false);
      return;
    }
    setRoutine(res.data);
    setSegments(RoutineUtils.initializeSegments(res.data.segments));
    setLoading(false);
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setSuccessMessage('');
      setEditMode(true);
      return;
    }
    dialog.show(
      'Dejar de editar',
      '¿Estás seguro/a que deseas continuar? Los cambios que no hayan sido guardados seran descartados.',
      () => setEditMode(false),
      {
        confirmText: 'Sí, descartar cambios',
        finalFocusRef: editModeRef,
      }
    );
  };

  const onEditSuccess = (r: Routine) => {
    setRoutine(r);
    setSegments(RoutineUtils.initializeSegments(r.segments));
    setSuccessMessage('Se han guardado los cambios');
    setEditMode(false);
  };

  useEffect(() => {
    if (!id || !Number(id)) {
      setLoading(false);
      return;
    }
    retrieveRoutine(Number(id));
  }, [id]);
  if (!loading && !routine) return <ResourceNotFound />;
  return (
    <ResponsiveCard defaultHeight='auto' position='relative' defaultWidth='800px'>
      <SimpleBreadcrumbs
        items={[
          { to: BRoutes.ROUTINES, title: 'Rutinas' },
          { to: '#contenido', title: 'Detalle' },
        ]}
      />
      <SkeletonWrapper loading={loading} heights={['60px', '90px', '60px']} height='70px' repeat={7} marginY={1}>
        <Flex justifyContent='space-between' mb={3} alignItems='center'>
          <LinkButton to={BRoutes.ROUTINES} leftIcon={<ArrowBackIcon />} size={['sm', 'md']}>
            Volver al listado
          </LinkButton>
          <Tooltip hasArrow label={editMode ? 'Salir de modo de edición' : 'Cambiar a modo de edición'}>
            <Button
              aria-label={editMode ? 'Salir de modo de edición' : 'Cambiar a modo de edición'}
              colorScheme='primary'
              size={['sm', 'md']}
              onClick={toggleEditMode}
              ref={editModeRef}
            >
              <Flex gap={2}>
                {editMode ? <EditOffIcon /> : <EditIcon />}
                <Text display={['none', 'none', 'inline']}>{editMode ? 'Dejar de editar' : 'Editar'}</Text>
              </Flex>
            </Button>
          </Tooltip>
          {dialog.render()}
        </Flex>
        <BAlert status='success' description={successMessage} autoFocus closable onClose={() => setSuccessMessage('')} />
        {routine && !editMode && <RoutineDetailsContent routine={routine} segments={segments} onSegmentsChange={() => setSegments} />}
        {routine && editMode && <RoutineEditForm routine={routine} segments={segments} onSuccess={onEditSuccess} />}
      </SkeletonWrapper>
    </ResponsiveCard>
  );
};

interface RoutineDetailsContentProps {
  routine: Routine;
  segments: DraggableSegment[];
  onSegmentsChange: (func: (segments: DraggableSegment[]) => DraggableSegment[]) => void;
}

export const RoutineDetailLabel = ({ children, ...props }: FormLabelProps) => (
  <FormLabel fontWeight='semibold' marginTop={3} mr={0} color='text.300' _dark={{ color: 'primary.200' }} {...props}>
    {children}
  </FormLabel>
);

const RoutineDetailsContent = ({ routine, segments }: RoutineDetailsContentProps) => {
  const totalDuration = useMemo(() => {
    let total = 0;
    segments.forEach((s) => (total += s.duration));
    return total;
  }, segments);

  return (
    <Flex direction='column'>
      <FormControl>
        <RoutineDetailLabel as='span' mb={0}>
          Nombre
        </RoutineDetailLabel>
        <Heading aria-label='Routine Name' color='text.500'>
          {routine.name}
        </Heading>
      </FormControl>

      {routine.description && (
        <FormControl>
          <RoutineDetailLabel as='span' mb={0}>
            Descripción
          </RoutineDetailLabel>
          <Heading size='md' as='h2' paddingY={2} color='text.500'>
            {routine.description}
          </Heading>
        </FormControl>
      )}

      {!!routine.students?.length && (
        <FormControl>
          <RoutineDetailLabel as='span' mb={0}>
            Alumnos
          </RoutineDetailLabel>

          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={'4px'} mt={3}>
            {routine.students.map((user) => (
              <Box
                position='relative'
                bg='bg.400'
                key={user.id}
                overflow='hidden'
                borderRadius='lg'
                padding={2}
                borderColor='chakra-border-color'
                borderWidth='1px'
                display='flex'
                gap={3}
                alignItems='center'
                justifyContent='space-between'
              >
                <Flex gap={3} alignItems='center'>
                  <BAvatar aria-hidden size='sm' name={`${user.firstName} ${user.lastName}`} />
                  <Flex direction='column' alignItems='start' justifyContent='start'>
                    <Text noOfLines={1} textOverflow='ellipsis'>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text fontSize='sm' fontWeight='light' aria-label='email' noOfLines={1} textOverflow='ellipsis' wordBreak='break-all'>
                      {user.email}
                    </Text>
                  </Flex>
                </Flex>
                <Tooltip label='Ir a detalle del alumno' hasArrow placement='right'>
                  <div>
                    <LinkButton to={`alumno/${user.id}`} height='auto' width='auto' minWidth={0} padding={2} background='transparent'>
                      <Icon as={UserLinkIcon} aria-hidden />
                      <VisuallyHidden>Ir a detalle del alumno</VisuallyHidden>
                    </LinkButton>
                  </div>
                </Tooltip>
              </Box>
            ))}
          </SimpleGrid>
        </FormControl>
      )}
      <Box position='relative' marginTop={2}>
        <Flex justifyContent='space-between' alignItems='center'>
          <RoutineDetailLabel as='span' marginBottom={3} marginTop={0}>
            Planificación
          </RoutineDetailLabel>
          {!!Number(totalDuration) && (
            <Tag colorScheme='blue' fontWeight='bold' borderRadius='20px' paddingY='3px'>
              <Icon as={StopwatchIcon} aria-hidden mr={1} />
              Duración total: {`${totalDuration}`} min
            </Tag>
          )}
        </Flex>
        {!!segments?.length ? (
          <Box background='bg.400' borderRadius='lg' mb={5} >
            <RoutineSegmentList displayOnly={true} maxHeight='400px' segments={segments} onChange={() => {}} onRemove={() => {}} onEdit={() => {}} />
          </Box>
        ) : (
          <Text>
            <InfoIcon aria-hidden mr={2} />
            Esta rutina no posee ningún segmento
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default RoutineDetails;
